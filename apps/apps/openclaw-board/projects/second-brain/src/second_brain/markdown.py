from __future__ import annotations

import json


def dump_markdown(frontmatter: dict[str, object], body: str) -> str:
    lines = ["---"]
    for key, value in frontmatter.items():
        lines.append(f"{key}: {json.dumps(value, ensure_ascii=True, sort_keys=True)}")
    lines.append("---")
    lines.append(body.rstrip())
    lines.append("")
    return "\n".join(lines)


def load_markdown(content: str) -> tuple[dict[str, object], str]:
    lines = content.splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValueError("Markdown document is missing frontmatter start marker")

    frontmatter: dict[str, object] = {}
    index = 1
    for index in range(1, len(lines)):
        line = lines[index]
        if line.strip() == "---":
            break
        key, separator, raw_value = line.partition(": ")
        if not separator:
            raise ValueError(f"Invalid frontmatter line: {line!r}")
        frontmatter[key] = json.loads(raw_value)
    else:
        raise ValueError("Markdown document is missing frontmatter end marker")

    body = "\n".join(lines[index + 1 :]).strip()
    return frontmatter, body