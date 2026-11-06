"""Writes the approved levels (proposal.csv's new_level) into the two word files.

Changes only the level: in backend/data/static/vocabulary_words.json the
difficulty_level of each word, matched by id; in docs/words/words.csv the
"Difficulty Level" field of each row, in place, matched to its word the way
the generator does (english word + source). Every other byte stays as it was.
Then it checks that: same ids in the same order, every other field equal,
and every CSV row naming the same level as its word. Standard library only.

Usage, from the repository root: python3 docs/words/relevel/apply.py
"""
import csv
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
JSON_PATH = ROOT / "backend/data/static/vocabulary_words.json"
CSV_PATH = ROOT / "docs/words/words.csv"
LEVEL_FIELD = 2


def parse_line(line: str) -> tuple[list[str], list[tuple[int, int]]]:
    """Fields as generateJsonData.js's parseCSVLine reads them (a quote only toggles), with their spans."""
    fields, spans, current, start, in_quotes = [], [], "", 0, False
    for i, ch in enumerate(line):
        if ch == '"':
            in_quotes = not in_quotes
        elif ch == "," and not in_quotes:
            fields.append(current)
            spans.append((start, i))
            current, start = "", i + 1
        else:
            current += ch
    fields.append(current)
    spans.append((start, len(line)))
    return fields, spans


def main() -> None:
    with (HERE / "proposal.csv").open(encoding="utf-8") as f:
        level_of = {r["id"]: int(r["new_level"]) for r in csv.DictReader(f)}

    before = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    if {w["id"] for w in before} != set(level_of):
        raise SystemExit("proposal.csv and vocabulary_words.json do not hold the same ids")
    after = [{**w, "difficulty_level": level_of[w["id"]]} for w in before]
    JSON_PATH.write_text(json.dumps(after, ensure_ascii=False, indent=2), encoding="utf-8")

    by_key = {f'{w["english_word"]}::{w["source"]}': level_of[w["id"]] for w in before}
    lines = CSV_PATH.read_text(encoding="utf-8").split("\n")
    changed = 0
    for n, line in enumerate(lines[1:], start=1):
        if not line.strip():
            continue
        fields, spans = parse_line(line)
        key = f"{fields[0].strip()}::{fields[3].strip()}"
        if key not in by_key:
            raise SystemExit(f"words.csv line {n + 1}: no word for {key!r}")
        a, b = spans[LEVEL_FIELD]
        new = str(by_key[key])
        if line[a:b].strip() != new:
            lines[n] = line[:a] + new + line[b:]
            changed += 1
    CSV_PATH.write_text("\n".join(lines), encoding="utf-8")

    # Checks: ids, order and every other field unchanged; the CSV agrees with the JSON.
    written = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    assert [w["id"] for w in written] == [w["id"] for w in before], "ids or their order changed"
    for old, new in zip(before, written):
        assert {k: v for k, v in old.items() if k != "difficulty_level"} == \
               {k: v for k, v in new.items() if k != "difficulty_level"}, f"{old['id']}: a field other than the level changed"
        assert new["difficulty_level"] == level_of[new["id"]]
    for line in CSV_PATH.read_text(encoding="utf-8").split("\n")[1:]:
        if line.strip():
            fields, _ = parse_line(line)
            assert int(fields[LEVEL_FIELD]) == by_key[f"{fields[0].strip()}::{fields[3].strip()}"]
    moved = sum(1 for o, w in zip(before, written) if o["difficulty_level"] != w["difficulty_level"])
    print(f"{len(written)} words: {moved} levels changed in the JSON, {changed} rows in words.csv; "
          "ids, order and every other field unchanged")
    diff = subprocess.run(["git", "diff", "--numstat", "--", str(JSON_PATH), str(CSV_PATH)],
                          cwd=ROOT, capture_output=True, text=True).stdout.strip()
    print(diff)


if __name__ == "__main__":
    main()
