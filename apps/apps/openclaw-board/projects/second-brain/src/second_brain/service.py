from __future__ import annotations

from pathlib import Path

from .adapters import ExternalNoteAdapter
from .context import ContextAssembler
from .indexing import AsyncIndexer
from .models import CaptureInput, ContentType, KnowledgeArtifact, KnowledgeMetadata, LifecycleState, utc_now
from .storage import MarkdownKnowledgeStore


class SecondBrainService:
    def __init__(self, store: MarkdownKnowledgeStore, indexer: AsyncIndexer, assembler: ContextAssembler | None = None) -> None:
        self.store = store
        self.indexer = indexer
        self.assembler = assembler or ContextAssembler()

    def capture(self, item: CaptureInput, identifier: str | None = None) -> KnowledgeArtifact:
        existing = self.store.load_by_id(identifier) if identifier else None
        now = utc_now().isoformat()
        content_type = classify_capture(item.kind)
        metadata = existing.metadata if existing else KnowledgeMetadata(
            identifier=identifier or self.store.new_identifier(),
            title=item.title,
            source=item.source,
            content_type=content_type,
            created_at=now,
            updated_at=now,
        )

        metadata.title = item.title
        metadata.source = item.source
        metadata.content_type = content_type
        metadata.updated_at = now
        metadata.tags = sorted(set(item.tags))
        metadata.task_refs = sorted(set(item.task_refs))
        metadata.classification = item.kind.lower()
        metadata.summary = summarize(item.body)
        metadata.lifecycle = metadata.lifecycle or LifecycleState.ACTIVE

        artifact = KnowledgeArtifact(metadata=metadata, body=item.body.strip())
        self.store.save(artifact)
        self.indexer.enqueue(artifact)
        return artifact

    async def process_indexing(self) -> int:
        return await self.indexer.process_pending()

    def search(self, query: str, limit: int = 5, active_task_refs: list[str] | None = None) -> list[KnowledgeArtifact]:
        artifacts = self.store.list_artifacts(include_archived=False)
        semantic_scores = dict(self.indexer.search(query, limit=max(limit * 3, 10)))
        ranked = self.assembler.rank(
            artifacts=artifacts,
            semantic_scores=semantic_scores,
            query=query,
            active_task_refs=active_task_refs,
            limit=limit,
        )
        return [result.artifact for result in ranked]

    def contextual_recall(self, query: str, active_task_refs: list[str] | None = None, limit: int = 5) -> list[KnowledgeArtifact]:
        return self.search(query=query, limit=limit, active_task_refs=active_task_refs)

    def export(self, identifier: str, adapter: ExternalNoteAdapter) -> KnowledgeArtifact:
        artifact = self._require(identifier)
        record = adapter.export(artifact)
        artifact.metadata.sync = [item for item in artifact.metadata.sync if item.adapter != record.adapter] + [record]
        self.store.save(artifact)
        return artifact

    def reconcile(self, identifier: str, external_body: str, adapter: ExternalNoteAdapter) -> KnowledgeArtifact:
        artifact = self._require(identifier)
        updated = adapter.reconcile(artifact, external_body)
        updated.metadata.updated_at = utc_now().isoformat()
        self.store.save(updated)
        self.indexer.enqueue(updated)
        return updated

    def archive(self, identifier: str) -> KnowledgeArtifact:
        artifact = self._require(identifier)
        previous_path = artifact.metadata.relative_path
        artifact.metadata.lifecycle = LifecycleState.ARCHIVED
        artifact.metadata.updated_at = utc_now().isoformat()
        artifact.metadata.relative_path = None
        self.store.save(artifact)
        if previous_path:
            previous_file = self.store.workspace_root / Path(previous_path)
            if previous_file.exists() and artifact.metadata.relative_path != previous_path:
                previous_file.unlink()
        self.indexer.enqueue(artifact)
        return artifact

    def _require(self, identifier: str) -> KnowledgeArtifact:
        artifact = self.store.load_by_id(identifier)
        if artifact is None:
            raise KeyError(f"Unknown artifact: {identifier}")
        return artifact


def classify_capture(kind: str) -> ContentType:
    normalized = kind.strip().lower()
    if normalized in {"message", "chat", "conversation"}:
        return ContentType.CONVERSATION
    if normalized in {"task", "todo", "action"}:
        return ContentType.TASK
    if normalized in {"reference", "link", "resource"}:
        return ContentType.REFERENCE
    return ContentType.NOTE


def summarize(body: str, limit: int = 160) -> str:
    flattened = " ".join(body.split())
    if len(flattened) <= limit:
        return flattened
    return f"{flattened[: limit - 3]}..."