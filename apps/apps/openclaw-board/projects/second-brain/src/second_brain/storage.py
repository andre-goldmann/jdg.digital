from __future__ import annotations

import hashlib
import uuid
from pathlib import Path

from .layout import WorkspaceLayout
from .markdown import dump_markdown, load_markdown
from .models import KnowledgeArtifact, KnowledgeMetadata, LifecycleState


class MarkdownKnowledgeStore:
    def __init__(self, workspace_root: str | Path):
        self.workspace_root = Path(workspace_root)
        self.layout = WorkspaceLayout(self.workspace_root)
        self.layout.ensure()

    def save(self, artifact: KnowledgeArtifact) -> Path:
        artifact.metadata.checksum = self.checksum_for(artifact.body)
        destination = self._resolve_path(artifact.metadata)
        artifact.metadata.relative_path = destination.relative_to(self.workspace_root).as_posix()
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(dump_markdown(artifact.metadata.to_dict(), artifact.body), encoding="utf-8")
        return destination

    def load_by_id(self, identifier: str) -> KnowledgeArtifact | None:
        for path in self.iter_paths():
            artifact = self.load_path(path)
            if artifact.metadata.identifier == identifier:
                return artifact
        return None

    def load_path(self, path: str | Path) -> KnowledgeArtifact:
        file_path = Path(path)
        frontmatter, body = load_markdown(file_path.read_text(encoding="utf-8"))
        metadata = KnowledgeMetadata.from_dict(frontmatter)
        if metadata.relative_path is None:
            metadata.relative_path = file_path.relative_to(self.workspace_root).as_posix()
        return KnowledgeArtifact(metadata=metadata, body=body)

    def list_artifacts(self, include_archived: bool = True) -> list[KnowledgeArtifact]:
        artifacts = [self.load_path(path) for path in self.iter_paths()]
        if include_archived:
            return artifacts
        return [artifact for artifact in artifacts if artifact.metadata.lifecycle is not LifecycleState.ARCHIVED]

    def iter_paths(self) -> list[Path]:
        return sorted(self.workspace_root.glob("**/*.md"))

    def checksum_for(self, body: str) -> str:
        return hashlib.sha256(body.encode("utf-8")).hexdigest()

    def new_identifier(self) -> str:
        return uuid.uuid4().hex

    def _resolve_path(self, metadata: KnowledgeMetadata) -> Path:
        if metadata.relative_path:
            return self.workspace_root / metadata.relative_path
        directory = self.layout.directory_for(metadata.content_type, metadata.lifecycle)
        safe_title = _slugify(metadata.title)
        return directory / f"{safe_title}-{metadata.identifier[:8]}.md"


def _slugify(value: str) -> str:
    cleaned = [character.lower() if character.isalnum() else "-" for character in value]
    slug = "".join(cleaned).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug or "entry"