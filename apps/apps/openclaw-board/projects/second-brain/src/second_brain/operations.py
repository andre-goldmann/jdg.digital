from __future__ import annotations

from dataclasses import dataclass

from .indexing import AsyncIndexer
from .service import SecondBrainService
from .storage import MarkdownKnowledgeStore


@dataclass(slots=True)
class IntegrityReport:
    checked: int
    errors: list[str]


class SecondBrainOperations:
    def __init__(self, store: MarkdownKnowledgeStore, indexer: AsyncIndexer, service: SecondBrainService) -> None:
        self.store = store
        self.indexer = indexer
        self.service = service

    async def reindex(self) -> int:
        return await self.indexer.rebuild(self.store.list_artifacts(include_archived=True))

    def archive(self, identifier: str):
        return self.service.archive(identifier)

    def verify(self) -> IntegrityReport:
        errors: list[str] = []
        artifacts = self.store.list_artifacts(include_archived=True)
        seen_ids: set[str] = set()
        for artifact in artifacts:
            metadata = artifact.metadata
            if metadata.identifier in seen_ids:
                errors.append(f"duplicate identifier: {metadata.identifier}")
            seen_ids.add(metadata.identifier)
            if not metadata.relative_path:
                errors.append(f"missing relative path: {metadata.identifier}")
            if metadata.checksum != self.store.checksum_for(artifact.body):
                errors.append(f"checksum mismatch: {metadata.identifier}")
        errors.extend(self.indexer.verify())
        return IntegrityReport(checked=len(artifacts), errors=errors)