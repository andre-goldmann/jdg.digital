from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from enum import StrEnum


def utc_now() -> datetime:
    return datetime.now(UTC)


class ContentType(StrEnum):
    NOTE = "note"
    CONVERSATION = "conversation"
    TASK = "task"
    REFERENCE = "reference"


class LifecycleState(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class SyncStatus(StrEnum):
    PENDING = "pending"
    SYNCED = "synced"
    CONFLICT = "conflict"


@dataclass(slots=True)
class SyncRecord:
    adapter: str
    external_id: str | None = None
    external_path: str | None = None
    checksum: str | None = None
    synced_at: str | None = None
    status: SyncStatus = SyncStatus.PENDING

    def to_dict(self) -> dict[str, object]:
        return {
            "adapter": self.adapter,
            "external_id": self.external_id,
            "external_path": self.external_path,
            "checksum": self.checksum,
            "synced_at": self.synced_at,
            "status": self.status.value,
        }

    @classmethod
    def from_dict(cls, value: dict[str, object]) -> "SyncRecord":
        status_value = value.get("status", SyncStatus.PENDING.value)
        return cls(
            adapter=str(value.get("adapter", "unknown")),
            external_id=_optional_str(value.get("external_id")),
            external_path=_optional_str(value.get("external_path")),
            checksum=_optional_str(value.get("checksum")),
            synced_at=_optional_str(value.get("synced_at")),
            status=SyncStatus(status_value),
        )


@dataclass(slots=True)
class KnowledgeMetadata:
    identifier: str
    title: str
    source: str
    content_type: ContentType
    created_at: str
    updated_at: str
    tags: list[str] = field(default_factory=list)
    lifecycle: LifecycleState = LifecycleState.ACTIVE
    sync: list[SyncRecord] = field(default_factory=list)
    classification: str | None = None
    summary: str | None = None
    relative_path: str | None = None
    checksum: str | None = None
    task_refs: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        return {
            "id": self.identifier,
            "title": self.title,
            "source": self.source,
            "type": self.content_type.value,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "tags": self.tags,
            "lifecycle": self.lifecycle.value,
            "sync": [record.to_dict() for record in self.sync],
            "classification": self.classification,
            "summary": self.summary,
            "relative_path": self.relative_path,
            "checksum": self.checksum,
            "task_refs": self.task_refs,
        }

    @classmethod
    def from_dict(cls, value: dict[str, object]) -> "KnowledgeMetadata":
        return cls(
            identifier=str(value["id"]),
            title=str(value["title"]),
            source=str(value["source"]),
            content_type=ContentType(str(value["type"])),
            created_at=str(value["created_at"]),
            updated_at=str(value["updated_at"]),
            tags=[str(item) for item in value.get("tags", [])],
            lifecycle=LifecycleState(str(value.get("lifecycle", LifecycleState.ACTIVE.value))),
            sync=[SyncRecord.from_dict(item) for item in value.get("sync", [])],
            classification=_optional_str(value.get("classification")),
            summary=_optional_str(value.get("summary")),
            relative_path=_optional_str(value.get("relative_path")),
            checksum=_optional_str(value.get("checksum")),
            task_refs=[str(item) for item in value.get("task_refs", [])],
        )


@dataclass(slots=True)
class KnowledgeArtifact:
    metadata: KnowledgeMetadata
    body: str


@dataclass(slots=True)
class CaptureInput:
    title: str
    body: str
    source: str
    kind: str
    tags: list[str] = field(default_factory=list)
    task_refs: list[str] = field(default_factory=list)


@dataclass(slots=True)
class SearchResult:
    artifact: KnowledgeArtifact
    semantic_score: float
    keyword_score: float
    recency_score: float
    active_task_score: float

    @property
    def total_score(self) -> float:
        return self.semantic_score + self.keyword_score + self.recency_score + self.active_task_score


@dataclass(slots=True)
class VectorRecord:
    identifier: str
    vector: list[float]
    title: str
    body: str
    content_type: str
    lifecycle: str
    task_refs: list[str]


def _optional_str(value: object) -> str | None:
    if value is None or value == "":
        return None
    return str(value)