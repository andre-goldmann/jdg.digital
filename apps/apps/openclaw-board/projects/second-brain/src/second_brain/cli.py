from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path

from .adapters import ObsidianVaultAdapter
from .context import ContextAssembler
from .indexing import AsyncIndexer, InMemoryVectorIndex, TokenEmbeddingProvider
from .milvus_backend import MilvusSettings, MilvusVectorIndex
from .models import CaptureInput
from .operations import SecondBrainOperations
from .service import SecondBrainService
from .storage import MarkdownKnowledgeStore


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="second-brain")
    parser.add_argument("--workspace", default="knowledge")
    parser.add_argument("--milvus-uri", default=os.getenv("SECOND_BRAIN_MILVUS_URI", "http://localhost:19530"))
    parser.add_argument("--milvus-collection", default=os.getenv("SECOND_BRAIN_MILVUS_COLLECTION", "second_brain_vectors"))
    parser.add_argument("--milvus-token", default=os.getenv("SECOND_BRAIN_MILVUS_TOKEN"))
    subparsers = parser.add_subparsers(dest="command", required=True)

    capture = subparsers.add_parser("capture")
    capture.add_argument("--title", required=True)
    capture.add_argument("--body", required=True)
    capture.add_argument("--source", required=True)
    capture.add_argument("--kind", required=True)
    capture.add_argument("--tag", action="append", default=[])
    capture.add_argument("--task-ref", action="append", default=[])
    capture.add_argument("--id")

    search = subparsers.add_parser("search")
    search.add_argument("query")
    search.add_argument("--limit", type=int, default=5)
    search.add_argument("--active-task-ref", action="append", default=[])

    export = subparsers.add_parser("export-obsidian")
    export.add_argument("identifier")
    export.add_argument("--vault", required=True)

    archive = subparsers.add_parser("archive")
    archive.add_argument("identifier")

    subparsers.add_parser("reindex")
    subparsers.add_parser("verify")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    service, operations = build_services(
        Path(args.workspace),
        milvus_uri=args.milvus_uri,
        milvus_collection=args.milvus_collection,
        milvus_token=args.milvus_token,
    )

    if args.command == "capture":
        artifact = service.capture(
            CaptureInput(
                title=args.title,
                body=args.body,
                source=args.source,
                kind=args.kind,
                tags=args.tag,
                task_refs=args.task_ref,
            ),
            identifier=args.id,
        )
        asyncio.run(service.process_indexing())
        print(artifact.metadata.identifier)
        return 0

    if args.command == "search":
        results = service.contextual_recall(args.query, active_task_refs=args.active_task_ref, limit=args.limit)
        print(json.dumps([artifact.metadata.to_dict() for artifact in results], indent=2))
        return 0

    if args.command == "export-obsidian":
        adapter = ObsidianVaultAdapter(args.vault)
        artifact = service.export(args.identifier, adapter)
        print(json.dumps(artifact.metadata.to_dict(), indent=2))
        return 0

    if args.command == "archive":
        artifact = operations.archive(args.identifier)
        asyncio.run(service.process_indexing())
        print(json.dumps(artifact.metadata.to_dict(), indent=2))
        return 0

    if args.command == "reindex":
        count = asyncio.run(operations.reindex())
        print(count)
        return 0

    if args.command == "verify":
        report = operations.verify()
        print(json.dumps({"checked": report.checked, "errors": report.errors}, indent=2))
        return 0 if not report.errors else 1

    parser.error(f"Unknown command: {args.command}")
    return 2


def build_services(
    workspace: Path,
    *,
    milvus_uri: str = "http://localhost:19530",
    milvus_collection: str = "second_brain_vectors",
    milvus_token: str | None = None,
) -> tuple[SecondBrainService, SecondBrainOperations]:
    store = MarkdownKnowledgeStore(workspace)
    settings = MilvusSettings(uri=milvus_uri, collection_name=milvus_collection, token=milvus_token)
    indexer = AsyncIndexer(TokenEmbeddingProvider(), MilvusVectorIndex(settings))
    service = SecondBrainService(store, indexer, ContextAssembler())
    operations = SecondBrainOperations(store, indexer, service)
    return service, operations


if __name__ == "__main__":
    raise SystemExit(main())