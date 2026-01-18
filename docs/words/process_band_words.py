#!/usr/bin/env python3
"""
Script to process Band II Lexis words from PDF and add to words.csv
"""

import csv
from typing import Set, List, Tuple

# All words extracted from Band22July18.pdf (Lexis Band II)
# Excluding example sentences (italic/blue text in original)
PDF_WORDS = [
    # Page 1
    "ability", "able", "absent", "absolutely", "accept", "by accident", "according to",
    "account", "take into account", "act", "active", "activity", "actually", "add",
    "in addition to", "admit", "adult", "advantage", "advertise", "advertisement",
    "advice", "advise", "afford", "after all", "against", "ahead of", "go ahead",
    "aim", "air", "alive", "along", "along with", "alphabet", "in alphabetical order",
    "alternative", "although", "altogether", "among", "amount", "announcement",
    "another", "any time", "anywhere", "any place", "apart from", "apartment",
    "apologize", "appearance", "apply to", "Arab", "area", "argue", "argument",
    "army", "around", "arrange", "arrangement", "arrive at", "art", "article",
    "as", "as...as", "as soon as", "as if", "asleep", "assessment", "available",
    "awake", "aware", "awful", "base", "based on", "basic", "basis", "beat",
    "become", "Bedouin", "Beduin", "behave", "behavior", "belong to", "below",
    "beyond", "date of birth", "blame", "blood", "blow", "boat", "border",
    "was born", "both...and", "bother", "don't bother", "bottom", "brain",
    "branch", "bridge", "bright", "broad", "business", "calendar", "camera",
    "camp", "cancel", "capital", "card", "take care of", "cash", "in common with",
    "credit card", "carry", "carry out", "case", "in any case",

    # Page 2
    "cause", "celebrate", "celebration", "century", "certain", "chance", "by chance",
    "chapter", "character", "in charge of", "check", "choice", "choose", "Christian",
    "Circassian", "circle", "city", "clever", "climate", "climb", "club", "clue",
    "clothes", "cloud", "coast", "coat", "code", "collect", "comfortable", "common",
    "in common", "communication", "company", "compare", "complain", "complete",
    "condition", "on condition that", "connect", "connection", "consider", "contact",
    "contents", "continue", "control", "under control", "conversation", "cook",
    "corner", "correct", "could", "couple", "a couple of", "course", "I took a course",
    "cover", "crazy", "cream", "create", "crime", "crowd", "culture", "cupboard",
    "dance", "danger", "in danger", "dangerous", "dead", "deal", "deal with",
    "a good deal", "a great deal", "death", "deep", "definitely", "definition",
    "delete", "deliver", "depend on", "it depends", "describe", "description",
    "desk", "detail", "difference", "make a difference", "it makes no difference",
    "dig", "digital", "dinner", "direction", "director", "disappear", "disappointed",
    "discover", "discuss", "discussion", "divide", "to do with", "doubt",
    "no doubt", "dramatic", "dream", "dress", "drop", "Druze", "Druz", "due to",
    "during", "each other",

    # Page 3
    "earth", "east", "education", "effect", "make an effort", "either...or",
    "electric", "else", "what else", "nothing else", "empty", "encourage", "energy",
    "engine", "enormous", "environment", "equal", "especially", "even", "even harder",
    "even if", "even though", "ever", "ever since", "exact", "exactly", "examination",
    "exciting", "excellent", "except", "expect", "experience", "explain", "explanation",
    "expert", "express", "extremely", "fail", "false", "famous", "as far as",
    "so far", "fat", "fear", "feed", "feel like", "festival", "few", "field",
    "fight", "file", "fill", "fill in", "fill out", "final", "finally", "finger",
    "at first", "first of all", "fish", "fit", "fix", "flat", "floor", "follow",
    "the following", "force", "foreign", "forest", "forever", "forgive", "form",
    "fortunately", "forward", "free", "frequently", "fresh", "frightening", "fruit",
    "fun", "furniture", "future", "garbage", "gas", "general", "in general",
    "get back", "get off", "get on", "get rid of", "get away", "get up", "give up",
    "go ahead", "go away", "go back", "go down", "go out", "go up", "god",
    "government", "grammar", "graph", "gray", "ground", "guy", "on the one hand",
    "on the other hand", "hardly", "hate", "headache", "health",

    # Page 4
    "healthy", "heart", "heat", "height", "heavy", "hers", "hide", "history",
    "hit", "holiday", "honest", "horrible", "hospital", "hotel", "however", "huge",
    "hurt", "husband", "no idea", "identify", "identity", "ill", "imagine",
    "improve", "include", "increase", "indeed", "independent", "individual",
    "information", "for instance", "instead of", "intelligent", "international",
    "interview", "introduce", "invent", "invitation", "involved with", "island",
    "issue", "item", "Jew", "Jewish", "join", "joke", "key", "kind", "knife",
    "label", "lady", "land", "at last", "laugh", "lay", "lead", "lead to",
    "leader", "least", "let", "library", "be likely to", "line", "limit",
    "limited to", "link", "a little", "load", "local", "lock", "long ago",
    "long before", "as long as", "no longer", "look after", "look for",
    "look forward to", "look like", "look up", "lose", "loud", "low", "lucky",
    "machine", "magazine", "mail", "main", "mainly", "mad", "manage to", "map",
    "mark", "market", "marry", "match", "material", "math", "maths", "no matter",
    "maximum", "may", "meal", "meat", "member", "mention", "might", "million",
    "mind", "never mind",

    # Page 5
    "I don't mind", "do you mind", "mine", "minimum", "modern", "moment",
    "more and more", "more or less", "Moslem", "Muslim", "mountain", "museum",
    "must", "nation", "nature", "neat", "necessary", "neither...nor", "nervous",
    "newspaper", "noise", "none", "normal", "north", "not only", "note", "notice",
    "a number of", "object", "occur", "odd", "offer", "office", "oil", "once again",
    "once more", "at once", "one another", "onto", "operate", "operation", "opinion",
    "in my opinion", "opportunity", "opposite", "ordinary", "order", "in order to",
    "ought to", "ours", "organize", "original", "on one's own", "pair", "park",
    "take part in", "particular", "in particular", "partner", "party", "passenger",
    "pass", "past", "perfect", "photo", "photograph", "take place", "plenty of",
    "plus", "point of view", "police", "popular", "position", "possible", "power",
    "powerful", "predict", "prefer", "present", "at present", "pressure", "previous",
    "price", "print", "private", "prize", "probably", "process", "program", "proper",
    "protect", "proud", "prove", "provide", "public", "purpose", "on purpose",
    "quarter", "quite", "quite a lot", "race", "railroad", "railway", "rain",
    "raise", "rather", "rather than",

    # Page 6
    "would rather", "reach", "realize", "reason", "receive", "recent", "recognize",
    "record", "regular", "relate", "relation", "relax", "religion", "religious",
    "remind", "repeat", "reply", "report", "request", "respect", "responsible for",
    "responsibility", "the rest", "result", "as a result of", "rice", "ride", "ring",
    "rise", "risk", "river", "role", "safe", "sale", "on sale", "salt", "save",
    "save money", "save time", "schedule", "science", "score", "sea", "search",
    "season", "seat", "second", "secret", "seem", "self", "sell", "serious",
    "serve", "service", "set", "set up", "several", "shape", "shirt", "shoes",
    "shop", "shopping", "go shopping", "should", "shoot", "silent", "silence",
    "silly", "silver", "similar to", "since", "singer", "single", "site", "smell",
    "smoke", "so that", "and so on", "social", "society", "soft", "solve", "sort",
    "sort of", "sort out", "sound", "south", "space", "specific", "speed", "spend",
    "spend money", "spend time", "in spite of", "stage", "the first stage of the game",
    "standard", "star", "state", "the State of Israel", "the state of play", "statement",
    "station", "step", "stick", "stage", "stay", "store", "strange", "strike",
    "go on strike", "study", "stuff", "stupid", "subject", "the subject of the article",
    "succeed in", "suggest", "suggestion", "suit", "support", "suppose", "make sure",

    # Page 7
    "surprise", "sweet", "switch off", "switch on", "taste", "team", "technology",
    "teenager", "teen", "tend to", "term", "terrible", "text", "over there",
    "-th", "fifth", "sixth", "theirs", "therefore", "thick", "thin", "thought",
    "through", "throw", "throw away", "throw out", "thousand", "ticket", "tidy",
    "all the time", "by the time", "in time", "on time", "at the same time", "title",
    "tool", "top", "topic", "total", "touch", "in touch with", "tour", "toward",
    "towards", "tradition", "traffic", "train", "translate", "translation", "transport",
    "trash", "travel", "treasure", "treat", "trick", "trouble", "trust", "tune",
    "type", "ugly", "unit", "unless", "up to", "used to", "be used to", "useful",
    "usual", "as usual", "vacation", "vegetable", "view", "village", "visit", "voice",
    "wake up", "warm", "warn", "waste", "wave", "by the way", "on the way", "weather",
    "weight", "west", "whatever", "which", "on the whole", "the whole", "whose",
    "wide", "wife", "win", "wind", "within", "wonder", "wood", "in other words",
    "at work", "worth...ing", "would", "worried about", "worry", "yet", "not yet",
    "yours", "zero"
]

def load_existing_words(csv_path: str) -> Set[str]:
    """Load existing English words from CSV (case-insensitive)"""
    existing = set()
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            existing.add(row['English Word'].lower().strip())
    return existing

def filter_new_words(pdf_words: List[str], existing: Set[str]) -> List[str]:
    """Filter out words that already exist"""
    new_words = []
    for word in pdf_words:
        # Normalize: lowercase and strip
        normalized = word.lower().strip()
        if normalized not in existing:
            # Keep original casing for the word
            new_words.append(word)
    return new_words

def main():
    csv_path = '/Users/Yossi.Zini/development/eng-tu/docs/words/words.csv'

    # Load existing words
    print("Loading existing words from CSV...")
    existing_words = load_existing_words(csv_path)
    print(f"Found {len(existing_words)} existing words")

    # Filter new words
    print(f"\nProcessing {len(PDF_WORDS)} words from PDF...")
    new_words = filter_new_words(PDF_WORDS, existing_words)
    print(f"Found {len(new_words)} new words to add")

    # Print sample of new words
    print(f"\nSample of new words (first 50):")
    for word in new_words[:50]:
        print(f"  - {word}")

    print(f"\nTotal new words: {len(new_words)}")
    print(f"\nNext step: Translate these {len(new_words)} words to Hebrew with difficulty levels 4-8")

if __name__ == '__main__':
    main()
