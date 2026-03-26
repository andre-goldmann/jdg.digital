from __future__ import annotations

from datetime import UTC, datetime

from .models import KnowledgeArtifact, SearchResult


class ContextAssembler:
    def rank(
        self,
        *,
        artifacts: list[KnowledgeArtifact],
        semantic_scores: dict[str, float],
        query: str,
        active_task_refs: list[str] | None = None,
        limit: int = 5,
    ) -> list[SearchResult]:
        active_task_refs = active_task_refs or []
        query_terms = {term.lower() for term in query.split()}
        ranked: list[SearchResult] = []

        for artifact in artifacts:
            semantic_score = semantic_scores.get(artifact.metadata.identifier, 0.0)
            keyword_score = self._keyword_score(query_terms, artifact)
            recency_score = self._recency_score(artifact.metadata.updated_at)
            active_task_score = self._active_task_score(artifact, active_task_refs)
            ranked.append(
                SearchResult(
                    artifact=artifact,
                    semantic_score=semantic_score,
                    keyword_score=keyword_score,
                    recency_score=recency_score,
                    active_task_score=active_task_score,
                )
            )

        ranked.sort(key=lambda item: item.total_score, reverse=True)
        return ranked[:limit]

    def _keyword_score(self, query_terms: set[str], artifact: KnowledgeArtifact) -> float:
        haystack = f"{artifact.metadata.title} {artifact.body}".lower()
        if not query_terms:
            return 0.0
        matches = sum(1 for term in query_terms if term in haystack)
        return matches / len(query_terms)

    def _recency_score(self, updated_at: str) -> float:
        updated = datetime.fromisoformat(updated_at)
        age_seconds = max((datetime.now(UTC) - updated).total_seconds(), 0.0)
        return 1.0 / (1.0 + (age_seconds / 86400.0))

    def _active_task_score(self, artifact: KnowledgeArtifact, active_task_refs: list[str]) -> float:
        if artifact.metadata.identifier in active_task_refs:
            return 1.5
        if any(task_ref in active_task_refs for task_ref in artifact.metadata.task_refs):
            return 1.0
        return 0.0