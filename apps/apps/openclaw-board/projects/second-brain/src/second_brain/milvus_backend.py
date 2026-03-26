from __future__ import annotations

from dataclasses import dataclass

from pymilvus import MilvusClient

from .indexing import VectorIndex
from .models import KnowledgeArtifact


@dataclass(slots=True)
class MilvusSettings:
    uri: str = "http://localhost:19530"
    collection_name: str = "second_brain_vectors"
    dimension: int = 0
    metric_type: str = "COSINE"
    token: str | None = None


class MilvusVectorIndex(VectorIndex):
    def __init__(self, settings: MilvusSettings):
        self.settings = settings
        self._client: MilvusClient | None = None

    @property
    def client(self) -> MilvusClient:
        if self._client is None:
            kwargs = {"uri": self.settings.uri}
            if self.settings.token:
                kwargs["token"] = self.settings.token
            self._client = MilvusClient(**kwargs)
        return self._client

    def ensure_collection(self, dimension: int) -> None:
        if dimension <= 0:
            raise ValueError("Milvus dimension must be greater than zero")
        if self.settings.dimension == 0:
            self.settings.dimension = dimension
        if self.settings.dimension != dimension:
            raise ValueError(f"Milvus dimension mismatch: expected {self.settings.dimension}, got {dimension}")
        if self.client.has_collection(collection_name=self.settings.collection_name):
            return
        self.client.create_collection(
            collection_name=self.settings.collection_name,
            dimension=dimension,
            primary_field_name="id",
            id_type="string",
            vector_field_name="vector",
            metric_type=self.settings.metric_type,
            auto_id=False,
            max_length=255,
        )

    def upsert(self, identifier: str, vector: list[float], artifact: KnowledgeArtifact) -> None:
        self.ensure_collection(len(vector))
        self.client.upsert(
            collection_name=self.settings.collection_name,
            data=[
                {
                    "id": identifier,
                    "vector": vector,
                    "title": artifact.metadata.title,
                    "body": artifact.body,
                    "content_type": artifact.metadata.content_type.value,
                    "lifecycle": artifact.metadata.lifecycle.value,
                    "task_refs": artifact.metadata.task_refs,
                }
            ],
        )

    def search(self, vector: list[float], limit: int = 5) -> list[tuple[str, float]]:
        self.ensure_collection(len(vector))
        results = self.client.search(
            collection_name=self.settings.collection_name,
            data=[vector],
            limit=limit,
            output_fields=["title", "content_type", "lifecycle", "task_refs"],
            search_params={"metric_type": self.settings.metric_type, "params": {}},
        )
        return [(str(item["id"]), float(item["distance"])) for item in results[0]]

    def clear(self) -> None:
        if self._client and self.client.has_collection(collection_name=self.settings.collection_name):
            self.client.drop_collection(collection_name=self.settings.collection_name)

    def verify(self) -> list[str]:
        try:
            if not self.client.has_collection(collection_name=self.settings.collection_name):
                return [f"missing milvus collection: {self.settings.collection_name}"]
        except Exception as error:  # pragma: no cover - backend exception surface
            return [f"milvus connection error: {error}"]
        return []