"""Proposes a new difficulty level (1-10) for every vocabulary word.

A score per word (higher = harder for a Hebrew-speaking student), then the
words in score order fill levels 1..10 to the planned sizes (SIZES). See
README.md for the reasoning behind each part of the score.

Usage, from the repository root, with a Python that has wordfreq (a dev-time
tool only; the app never imports it):

    python docs/words/relevel/relevel.py

Reads  backend/data/static/vocabulary_words.json  (the words and their ids)
       backend/src/data/wordGroups.json           (concrete word groups)
       docs/words/relevel/moves.csv               (moves made by hand, with reasons)
Writes docs/words/relevel/proposal.csv            (every word: old level, score parts, new level)
       docs/words/relevel/report.md               (per level, before and after)
"""
import csv
import json
import re
import statistics
from collections import Counter
from pathlib import Path

from wordfreq import zipf_frequency

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
WORDS = ROOT / "backend/data/static/vocabulary_words.json"
GROUPS = ROOT / "backend/src/data/wordGroups.json"
MOVES = HERE / "moves.csv"

# Planned level sizes, easy to hard: small easy levels, larger hard ones.
# Level 10 takes the rest.
SIZES = [150, 200, 250, 300, 330, 360, 400, 420, 440]

# Groups of concrete, everyday words a child learns first (wordGroups.json).
CONCRETE = {"animals", "food", "meals", "colours", "family", "people", "body", "clothes", "days",
            "months", "seasons", "time", "numbers", "nature", "places", "home", "school", "subjects",
            "transport", "jobs", "feelings", "directions", "moving", "daily", "question words"}
# Everyday but less concrete groups. Not "place words": through, against and at are
# hard to translate alone (the basic ones, in and under, are among band22's curated words).
EVERYDAY = {"ordinals", "speaking", "thinking", "having", "mine and yours"}

FREQ_CAP = 6.0          # zipf above this is as easy as this (very frequent grammar words)
FREQ_WEIGHT = 1.2       # per zipf point below the cap (one point = ten times rarer)
# Band II (junior high) before Band III (high school). Heavier weights put
# frequent Band III words above rarer Band II ones and break the frequency order.
BAND = {"band22": 0.0, "scrap": 0.3, "band33july18": 0.6, "lexisband3": 1.0}
CURATED_BASIC = -1.0    # band22's hand-picked first levels (1-4)
CONCRETE_BONUS = -1.8   # a child learns "cow" before "would", though "would" is far more frequent
EVERYDAY_BONUS = -0.7
TWO_WORDS = 0.6
THREE_WORDS = 1.2
PATTERN = 1.0           # "as...as", "sth", "sb", "etc", "-th"
PHRASAL = 0.5           # verb + particle ("pick up")
# A frequent word in no group and not curated is mostly grammar or abstract,
# hard to translate alone: would, yet, even (zipf 5.5+); issue, process, data (5.0-5.5).
GRAMMAR = 1.2
ABSTRACT = 0.8
# Long words are harder to learn and are often abstract (opportunity, environment);
# per letter beyond LENGTH_FREE, single words only (phrases pay for their words).
LENGTH_FREE = 6
LENGTH = 0.12
MIN_LEVEL_SHAPED = 5    # patterns, phrasal verbs and phrases of 3+ words start here

PARTICLES = {"up", "down", "off", "on", "out", "in", "away", "back", "over", "around", "about",
             "along", "through", "into", "after", "by", "for", "with"}


def core(english: str) -> str:
    """The first sense, without optional parts, placeholders, alternatives or a leading a/an/the/to."""
    s = re.split(r"\s+/\s+|;", english)[0].lower()
    s = re.sub(r"\([^)]*\)", " ", s)
    s = s.replace("...", " ").replace("…", " ")
    s = re.sub(r"\b(sth|sb|sb's|etc)\b\.?", " ", s)
    s = " ".join(tok.split("/")[0] for tok in s.split())
    s = re.sub(r"[^a-z' -]", " ", s)
    s = " ".join(s.split())
    parts = s.split()
    if len(parts) > 1 and parts[0] in ("a", "an", "the", "to"):
        s = " ".join(parts[1:])
    return s.strip(" -")


def shape(english: str, c: str) -> dict:
    words = len(c.split())
    pattern = bool(re.search(r"\.\.\.|…|\b(sth|sb|etc)\b", english) or english.strip().startswith("-"))
    phrasal = words >= 2 and c.split()[-1] in PARTICLES and not pattern
    return {"words": words, "pattern": pattern, "phrasal": phrasal}


def load_groups() -> dict:
    groups = json.loads(GROUPS.read_text(encoding="utf-8"))["groups"]
    of = {}
    for name, members in groups.items():
        for m in members:
            of.setdefault(m.lower(), set()).add(name)
    return of


def load_moves() -> dict:
    """Hand moves: id -> (level, reason)."""
    if not MOVES.exists():
        return {}
    with MOVES.open(encoding="utf-8") as f:
        return {r["id"]: (int(r["level"]), r["reason"]) for r in csv.DictReader(f)}


def band_of(source: str) -> float:
    return min(BAND.get(s, 1.0) for s in source.split(","))


def score(word: dict, groups_of: dict) -> dict:
    english = word["english_word"]
    c = core(english)
    z = zipf_frequency(c, "en") if c else 0.0
    sh = shape(english, c)
    groups = groups_of.get(c, set()) | groups_of.get(english.lower(), set())
    curated = "band22" in word["source"].split(",") and word["difficulty_level"] <= 4
    concrete = bool(groups & CONCRETE)
    everyday = bool(groups & EVERYDAY)
    parts = {
        "freq": round((FREQ_CAP - min(z, FREQ_CAP)) * FREQ_WEIGHT, 2),
        "band": band_of(word["source"]),
        "basic": CURATED_BASIC if curated else 0.0,
        "group": CONCRETE_BONUS if concrete else EVERYDAY_BONUS if everyday else 0.0,
        "shape": (THREE_WORDS if sh["words"] >= 3 else TWO_WORDS if sh["words"] == 2 else 0.0)
                 + (PATTERN if sh["pattern"] else 0.0) + (PHRASAL if sh["phrasal"] else 0.0),
        "grammar": 0.0 if (curated or concrete or everyday) else GRAMMAR if z >= 5.5 else ABSTRACT if z >= 5.0 else 0.0,
        "length": round(max(0, len(c) - LENGTH_FREE) * LENGTH, 2) if sh["words"] == 1 else 0.0,
    }
    min_level = MIN_LEVEL_SHAPED if (sh["pattern"] or sh["phrasal"] or sh["words"] >= 3) else 1
    return {"core": c, "zipf": z, **sh, "parts": parts, "score": round(sum(parts.values()), 2),
            "min_level": min_level}


def assign(rows: list, moves: dict) -> None:
    """Fill levels 1..10 in score order to SIZES. A word moved by hand is pinned to its
    level and takes one of its places; a shaped word waits for its minimum level."""
    for r in rows:
        r["proposed"] = moves[r["word"]["id"]][0] if r["word"]["id"] in moves else None
    pinned = Counter(r["proposed"] for r in rows if r["proposed"])
    queue = sorted((r for r in rows if not r["proposed"]),
                   key=lambda r: (r["score"], r["word"]["english_word"].lower()))
    for level, size in enumerate(SIZES + [len(rows)], start=1):
        taken = [r for r in queue if r["min_level"] <= level][:max(0, size - pinned[level])]
        for r in taken:
            r["proposed"] = level
        ids = {id(r) for r in taken}
        queue = [r for r in queue if id(r) not in ids]


def report(rows: list, key: str) -> list:
    lines = ["| Level | Words | Median zipf | Band III | Concrete | Multi-word | Patterns | First letters |",
             "|---|---|---|---|---|---|---|---|"]
    for level in range(1, 11):
        rs = [r for r in rows if r[key] == level]
        if not rs:
            lines.append(f"| {level} | 0 | | | | | | |")
            continue
        med = statistics.median(r["zipf"] for r in rs)
        band3 = sum("band22" not in r["word"]["source"] and "scrap" not in r["word"]["source"] for r in rs) / len(rs)
        concrete = sum(r["parts"]["group"] == CONCRETE_BONUS for r in rs) / len(rs)
        multi = sum(r["words"] > 1 for r in rs) / len(rs)
        pat = sum(r["pattern"] for r in rs)
        letters = Counter(r["core"][:1] for r in rs if r["core"])
        top = len([l for l, n in letters.items() if n >= 3])
        lines.append(f"| {level} | {len(rs)} | {med:.2f} | {band3:.0%} | {concrete:.0%} | {multi:.0%} | {pat} | "
                     f"{top} letters with 3+ words |")
    return lines


def main() -> None:
    words = json.loads(WORDS.read_text(encoding="utf-8"))
    groups_of = load_groups()
    moves = load_moves()
    unknown = set(moves) - {w["id"] for w in words}
    if unknown:
        raise SystemExit(f"moves.csv names ids that are not words: {sorted(unknown)}")
    rows = [{"word": w, **score(w, groups_of)} for w in words]
    assign(rows, moves)
    for r in rows:
        r["final"] = r["proposed"]
        r["reason"] = moves[r["word"]["id"]][1] if r["word"]["id"] in moves else ""
        r["old"] = r["word"]["difficulty_level"]

    with (HERE / "proposal.csv").open("w", encoding="utf-8", newline="") as f:
        out = csv.writer(f)
        out.writerow(["id", "english_word", "hebrew_translation", "source", "old_level", "zipf", "words",
                      "pattern", "phrasal", "freq", "band", "basic", "group", "shape", "grammar", "length", "score",
                      "new_level", "hand_move_reason"])
        for r in sorted(rows, key=lambda r: (r["final"], r["score"])):
            w, p = r["word"], r["parts"]
            out.writerow([w["id"], w["english_word"], w["hebrew_translation"], w["source"], r["old"],
                          f"{r['zipf']:.2f}", r["words"], int(r["pattern"]), int(r["phrasal"]), p["freq"],
                          p["band"], p["basic"], p["group"], p["shape"], p["grammar"], p["length"], r["score"],
                          r["final"], r["reason"]])

    text = ["# Re-levelling report", "",
            "Generated by `relevel.py`; do not edit by hand.", "",
            f"{len(rows)} words, {len(moves)} hand moves.", "",
            "## Before (the source lists' levels)", "", *report(rows, "old"), "",
            "## After (proposed, with the hand moves)", "", *report(rows, "final"), ""]
    (HERE / "report.md").write_text("\n".join(text), encoding="utf-8")
    print("\n".join(text))


if __name__ == "__main__":
    main()
