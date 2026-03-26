from __future__ import annotations

import asyncio
import hashlib
import math
import re
from dataclasses import dataclass
from typing import Protocol

from .models import KnowledgeArtifact


EmbeddingVector = list[float]


class TokenEmbeddingProvider:
    token_pattern = re.compile(r"[a-zA-Z0-9_]+")

    def __init__(self, dimension: int = 128):
        if dimension <= 1:
            raise ValueError("Embedding dimension must be greater than one")
        self.dimension = dimension

    def embed(self, text: str) -> EmbeddingVector:
        vector = [0.0] * self.dimension
        tokens = [token.lower() for token in self.token_pattern.findall(text)]
        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            index = int.from_bytes(digest[:4], byteorder="big") % self.dimension
            sign = 1.0 if digest[4] % 2 == 0 else -1.0
            vector[index] += sign
        norm = math.sqrt(sum(value * value for value in vector)) or 1.0
        return [value / norm for value in vector]


@dataclass(slots=True)
class IndexedDocument:
    identifier: str
    vector: EmbeddingVector
    body: str


class VectorIndex(Protocol):
    def upsert(self, identifier: str, vector: EmbeddingVector, artifact: KnowledgeArtifact) -> None:
        raise NotImplementedError

    def search(self, vector: EmbeddingVector, limit: int = 5) -> list[tuple[str, float]]:
        raise NotImplementedError

    def clear(self) -> None:
        raise NotImplementedError

    def verify(self) -> list[str]:
        raise NotImplementedError


class InMemoryVectorIndex:
    def __init__(self) -> None:
        self._documents: dict[str, IndexedDocument] = {}

    def upsert(self, identifier: str, vector: EmbeddingVector, artifact: KnowledgeArtifact) -> None:
        self._documents[identifier] = IndexedDocument(identifier=identifier, vector=vector, body=artifact.body)

    def search(self, vector: EmbeddingVector, limit: int = 5) -> list[tuple[str, float]]:
        scored = []
        for document in self._documents.values():
            score = _cosine_similarity(vector, document.vector)
            if score > 0:
                scored.append((document.identifier, score))
        scored.sort(key=lambda item: item[1], reverse=True)
        return scored[:limit]

    def clear(self) -> None:
        self._documents.clear()

    def verify(self) -> list[str]:
        return []


class AsyncIndexer:
    def __init__(self, embedding_provider: TokenEmbeddingProvider, vector_index: VectorIndex) -> None:
        self.embedding_provider = embedding_provider
        self.vector_index = vector_index
        self._queue: asyncio.Queue[KnowledgeArtifact] = asyncio.Queue()

    def enqueue(self, artifact: KnowledgeArtifact) -> None:
        self._queue.put_nowait(artifact)

    async def process_pending(self) -> int:
        processed = 0
        while not self._queue.empty():
            artifact = await self._queue.get()
            payload = f"{artifact.metadata.title}\n{artifact.body}"
            vector = self.embedding_provider.embed(payload)
            self.vector_index.upsert(artifact.metadata.identifier, vector, artifact)
            processed += 1
            self._queue.task_done()
        return processed

    async def rebuild(self, artifacts: list[KnowledgeArtifact]) -> int:
        self.vector_index.clear()
        for artifact in artifacts:
            self.enqueue(artifact)
        return await self.process_pending()

    def search(self, query: str, limit: int = 5) -> list[tuple[str, float]]:
        query_vector = self.embedding_provider.embed(query)
        return self.vector_index.search(query_vector, limit=limit)

    def verify(self) -> list[str]:
        return self.vector_index.verify()
def _cosine_similarity(left: EmbeddingVector, right: EmbeddingVector) -> float:
    if not left or not right:
        return 0.0
    return sum(left_value * right_value for left_value, right_value in zip(left, right, strict=False))