from __future__ import annotations

from pathlib import Path
from typing import Protocol

from .markdown import dump_markdown
from .models import KnowledgeArtifact, SyncRecord, SyncStatus, utc_now


class ExternalNoteAdapter(Protocol):
    name: str

    def export(self, artifact: KnowledgeArtifact) -> SyncRecord:
        raise NotImplementedError

    def reconcile(self, artifact: KnowledgeArtifact, external_body: str) -> KnowledgeArtifact:
        raise NotImplementedError


class ObsidianVaultAdapter:
    name = "obsidian"

    def __init__(self, vault_root: str | Path):
        self.vault_root = Path(vault_root)
        self.vault_root.mkdir(parents=True, exist_ok=True)

    def export(self, artifact: KnowledgeArtifact) -> SyncRecord:
        relative_path = artifact.metadata.relative_path or f"{artifact.metadata.identifier}.md"
        destination = self.vault_root / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(dump_markdown(artifact.metadata.to_dict(), artifact.body), encoding="utf-8")
        return SyncRecord(
            adapter=self.name,
            external_id=artifact.metadata.identifier,
            external_path=str(destination),
            checksum=artifact.metadata.checksum,
            synced_at=utc_now().isoformat(),
            status=SyncStatus.SYNCED,
        )

    def reconcile(self, artifact: KnowledgeArtifact, external_body: str) -> KnowledgeArtifact:
        if external_body.strip() == artifact.body.strip():
            record = self._record_for(artifact, SyncStatus.SYNCED)
        else:
            artifact.body = external_body.strip()
            record = self._record_for(artifact, SyncStatus.CONFLICT)
        artifact.metadata.sync = [item for item in artifact.metadata.sync if item.adapter != self.name] + [record]
        return artifact

    def _record_for(self, artifact: KnowledgeArtifact, status: SyncStatus) -> SyncRecord:
        return SyncRecord(
            adapter=self.name,
            external_id=artifact.metadata.identifier,
            external_path=str(self.vault_root / (artifact.metadata.relative_path or f"{artifact.metadata.identifier}.md")),
            checksum=artifact.metadata.checksum,
            synced_at=utc_now().isoformat(),
            status=status,
        )