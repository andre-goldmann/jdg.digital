from __future__ import annotations

import asyncio
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from second_brain.adapters import ObsidianVaultAdapter
from second_brain.cli import build_services
from second_brain.indexing import AsyncIndexer, InMemoryVectorIndex, TokenEmbeddingProvider
from second_brain.milvus_backend import MilvusSettings, MilvusVectorIndex
from second_brain.models import CaptureInput, LifecycleState, SyncStatus
from second_brain.operations import SecondBrainOperations
from second_brain.service import SecondBrainService
from second_brain.storage import MarkdownKnowledgeStore


class SecondBrainTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.workspace = Path(self.temp_dir.name) / "knowledge"
        self.store = MarkdownKnowledgeStore(self.workspace)
        self.indexer = AsyncIndexer(TokenEmbeddingProvider(), InMemoryVectorIndex())
        self.service = SecondBrainService(self.store, self.indexer)
        self.operations = SecondBrainOperations(self.store, self.indexer, self.service)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_capture_and_persist_across_sessions(self) -> None:
        artifact = self.service.capture(
            CaptureInput(
                title="Weekly idea",
                body="Build a semantic memory system for project notes.",
                source="chat",
                kind="idea",
                tags=["memory", "planning"],
            )
        )
        asyncio.run(self.service.process_indexing())

        self.assertEqual("notes", Path(artifact.metadata.relative_path).parts[0])
        reloaded = MarkdownKnowledgeStore(self.workspace).load_by_id(artifact.metadata.identifier)
        self.assertIsNotNone(reloaded)
        self.assertEqual("Weekly idea", reloaded.metadata.title)
        self.assertEqual(["memory", "planning"], reloaded.metadata.tags)

    def test_update_preserves_identifier_and_path(self) -> None:
        original = self.service.capture(
            CaptureInput(
                title="Sprint task",
                body="Initial task details",
                source="chat",
                kind="task",
                task_refs=["task-42"],
            )
        )
        updated = self.service.capture(
            CaptureInput(
                title="Sprint task",
                body="Refined task details with acceptance criteria",
                source="chat",
                kind="task",
                task_refs=["task-42"],
            ),
            identifier=original.metadata.identifier,
        )

        self.assertEqual(original.metadata.identifier, updated.metadata.identifier)
        self.assertEqual(original.metadata.relative_path, updated.metadata.relative_path)
        self.assertIn("acceptance criteria", self.store.load_by_id(updated.metadata.identifier).body)

    def test_contextual_recall_prioritizes_active_tasks(self) -> None:
        task = self.service.capture(
            CaptureInput(
                title="Launch migration",
                body="Track the database migration and rollout plan.",
                source="chat",
                kind="task",
                task_refs=["launch-migration"],
            )
        )
        self.service.capture(
            CaptureInput(
                title="Migration note",
                body="Database rollout checklist and rollback steps.",
                source="chat",
                kind="note",
                task_refs=[task.metadata.identifier],
            )
        )
        self.service.capture(
            CaptureInput(
                title="Old note",
                body="Database history from an older unrelated project.",
                source="chat",
                kind="note",
            )
        )
        asyncio.run(self.service.process_indexing())

        results = self.service.contextual_recall("database rollout", active_task_refs=[task.metadata.identifier], limit=2)
        self.assertEqual(task.metadata.identifier, results[0].metadata.identifier)

    def test_export_reconcile_and_sync_tracking(self) -> None:
        artifact = self.service.capture(
            CaptureInput(
                title="Reference card",
                body="Important API details",
                source="chat",
                kind="reference",
            )
        )
        vault = Path(self.temp_dir.name) / "vault"
        adapter = ObsidianVaultAdapter(vault)
        exported = self.service.export(artifact.metadata.identifier, adapter)

        self.assertEqual(SyncStatus.SYNCED, exported.metadata.sync[0].status)
        self.assertTrue(Path(exported.metadata.sync[0].external_path).exists())

        reconciled = self.service.reconcile(artifact.metadata.identifier, "Changed externally", adapter)
        self.assertEqual(SyncStatus.CONFLICT, reconciled.metadata.sync[0].status)

    def test_archive_reindex_verify_and_degraded_index(self) -> None:
        archived = self.service.capture(
            CaptureInput(
                title="Dormant plan",
                body="Archive this when it is no longer active.",
                source="chat",
                kind="note",
            )
        )
        asyncio.run(self.service.process_indexing())
        archived = self.operations.archive(archived.metadata.identifier)
        asyncio.run(self.service.process_indexing())

        self.assertEqual(LifecycleState.ARCHIVED, archived.metadata.lifecycle)
        self.assertEqual("archives", Path(archived.metadata.relative_path).parts[0])

        count = asyncio.run(self.operations.reindex())
        report = self.operations.verify()
        self.assertGreaterEqual(count, 1)
        self.assertEqual([], report.errors)

        self.indexer.vector_index.clear()
        active = self.service.capture(
            CaptureInput(
                title="Current note",
                body="Keyword retrieval still works without semantic vectors.",
                source="chat",
                kind="note",
            )
        )
        results = self.service.search("keyword retrieval", limit=1)
        self.assertEqual(active.metadata.identifier, results[0].metadata.identifier)

    def test_large_corpus_reindex(self) -> None:
        for index in range(150):
            self.service.capture(
                CaptureInput(
                    title=f"Idea {index}",
                    body=f"Vector index document number {index} for project search.",
                    source="chat",
                    kind="idea",
                    tags=["bulk"],
                )
            )

        processed = asyncio.run(self.service.process_indexing())
        rebuilt = asyncio.run(self.operations.reindex())
        results = self.service.search("project search", limit=3)

        self.assertEqual(150, processed)
        self.assertEqual(150, rebuilt)
        self.assertEqual(3, len(results))


class CliBootstrapTestCase(unittest.TestCase):
    def test_build_services_creates_workspace_layout(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir) / "cli-workspace"
            service, operations = build_services(workspace)

            self.assertIsInstance(service, SecondBrainService)
            self.assertIsInstance(operations, SecondBrainOperations)
            self.assertTrue((workspace / "notes").exists())
            self.assertTrue((workspace / "archives" / "notes").exists())


class FakeMilvusClient:
    def __init__(self) -> None:
        self.collections: dict[str, list[dict[str, object]]] = {}

    def has_collection(self, collection_name: str) -> bool:
        return collection_name in self.collections

    def create_collection(self, collection_name: str, dimension: int, **_: object) -> None:
        self.collections[collection_name] = []

    def upsert(self, collection_name: str, data: list[dict[str, object]]) -> None:
        bucket = self.collections.setdefault(collection_name, [])
        for row in data:
            bucket[:] = [item for item in bucket if item["id"] != row["id"]]
            bucket.append(row)

    def search(self, collection_name: str, data: list[list[float]], limit: int, **_: object) -> list[list[dict[str, object]]]:
        query = data[0]
        rows = self.collections.get(collection_name, [])
        scored: list[dict[str, object]] = []
        for row in rows:
            score = sum(left * right for left, right in zip(query, row["vector"], strict=False))
            scored.append({"id": row["id"], "distance": score, "entity": row})
        scored.sort(key=lambda item: item["distance"], reverse=True)
        return [scored[:limit]]

    def drop_collection(self, collection_name: str) -> None:
        self.collections.pop(collection_name, None)


class MilvusBackendTestCase(unittest.TestCase):
    def test_milvus_adapter_bootstraps_upserts_and_searches(self) -> None:
        settings = MilvusSettings(uri="http://localhost:9091", collection_name="unit_test_vectors")
        backend = MilvusVectorIndex(settings)
        backend._client = FakeMilvusClient()

        artifact = self._artifact("doc-1", "Alpha", "Semantic memory for launch tasks")
        vector = TokenEmbeddingProvider().embed(f"{artifact.metadata.title}\n{artifact.body}")
        backend.upsert(artifact.metadata.identifier, vector, artifact)
        results = backend.search(vector, limit=1)

        self.assertEqual([(artifact.metadata.identifier, results[0][1])], [(results[0][0], results[0][1])])
        self.assertEqual([], backend.verify())

    def test_milvus_verify_reports_missing_collection(self) -> None:
        settings = MilvusSettings(uri="http://localhost:9091", collection_name="missing_vectors")
        backend = MilvusVectorIndex(settings)
        backend._client = FakeMilvusClient()

        self.assertEqual(["missing milvus collection: missing_vectors"], backend.verify())

    def _artifact(self, identifier: str, title: str, body: str):
        service = SecondBrainService(MarkdownKnowledgeStore(Path(tempfile.mkdtemp()) / "knowledge"), AsyncIndexer(TokenEmbeddingProvider(), InMemoryVectorIndex()))
        return service.capture(CaptureInput(title=title, body=body, source="test", kind="note"), identifier=identifier)


if __name__ == "__main__":
    unittest.main()