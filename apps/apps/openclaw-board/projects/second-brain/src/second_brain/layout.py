from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from .models import ContentType, LifecycleState


@dataclass(slots=True)
class WorkspaceLayout:
    root: Path

    @property
    def notes_dir(self) -> Path:
        return self.root / "notes"

    @property
    def conversations_dir(self) -> Path:
        return self.root / "conversations"

    @property
    def tasks_dir(self) -> Path:
        return self.root / "tasks"

    @property
    def references_dir(self) -> Path:
        return self.root / "references"

    @property
    def archives_dir(self) -> Path:
        return self.root / "archives"

    def ensure(self) -> None:
        for directory in (
            self.notes_dir,
            self.conversations_dir,
            self.tasks_dir,
            self.references_dir,
            self.archives_dir / "notes",
            self.archives_dir / "conversations",
            self.archives_dir / "tasks",
            self.archives_dir / "references",
        ):
            directory.mkdir(parents=True, exist_ok=True)

    def directory_for(self, content_type: ContentType, lifecycle: LifecycleState) -> Path:
        if lifecycle is LifecycleState.ARCHIVED:
            return self.archives_dir / self._folder_name(content_type)
        return {
            ContentType.NOTE: self.notes_dir,
            ContentType.CONVERSATION: self.conversations_dir,
            ContentType.TASK: self.tasks_dir,
            ContentType.REFERENCE: self.references_dir,
        }[content_type]

    def _folder_name(self, content_type: ContentType) -> str:
        return {
            ContentType.NOTE: "notes",
            ContentType.CONVERSATION: "conversations",
            ContentType.TASK: "tasks",
            ContentType.REFERENCE: "references",
        }[content_type]