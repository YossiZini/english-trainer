#!/usr/bin/env python3
"""
Merge scrap.csv into words.csv with source tracking
"""

import csv

# Difficulty levels for new words from scrap.csv (1-10 for 12-year-old Hebrew speakers)
DIFFICULTY_MAPPINGS = {
    # Level 4-5: Common words
    'pour': 5,
    'prepare': 5,
    'pay': 5,
    'return': 5,
    'restaurant': 4,
    'presents': 4,
    'snack': 4,
    'gram': 5,
    'reading': 5,
    'walk (noun)': 4,
    'job': 5,
    'soap': 4,
    'helicopter': 6,
    'model': 5,
    'piece': 5,
    'police officer': 4,
    'project': 5,
    'size': 4,
    'person': 4,
    'worker': 5,
    'a bit': 4,
    'alone': 5,
    'online': 4,
    'each': 5,
    'very much': 4,
    'no problem': 4,
    'surprised': 5,
    'popular': 5,

    # Level 5-6: Phrasal verbs and intermediate
    'grow up': 5,
    'give out': 6,
    'give in': 6,
    'get down': 5,
    'get something down': 6,
    'write down': 5,
    'pick up': 5,
    'pack': 5,
    'spare time': 6,
    'too much': 5,
    'as...as': 6,
    'all sorts of': 6,
    'most': 5,
    'while': 6,
    'except for': 6,
    'during': 5,
    'huge': 6,

    # Level 6-7: More complex
    'badly': 6,
    'middle / in the middle': 5,
    'possible': 6,
    'away': 6,
    'either': 7,
    'pleasant': 6,
    'till': 6,
    'through': 7,
}

def main():
    # Load existing words.csv
    print("Loading existing words.csv...")
    existing_words = {}
    with open('words.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            existing_words[row['English Word'].lower()] = {
                'English Word': row['English Word'],
                'Hebrew Translation': row['Hebrew Translation'],
                'Difficulty Level': row['Difficulty Level'],
                'Source': 'band22'
            }

    print(f"  Loaded {len(existing_words)} existing words")

    # Load scrap.csv
    print("\nLoading scrap.csv...")
    scrap_words = []
    with open('scrap.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            scrap_words.append({
                'english': row['word'],
                'hebrew': row['translation']
            })

    print(f"  Loaded {len(scrap_words)} words from scrap.csv")

    # Check for duplicates and add new words
    print("\nProcessing words...")
    new_count = 0
    dup_count = 0

    for word in scrap_words:
        word_lower = word['english'].lower()

        if word_lower not in existing_words:
            # New word - add it
            difficulty = DIFFICULTY_MAPPINGS.get(word['english'], 5)  # Default to 5 if not mapped

            existing_words[word_lower] = {
                'English Word': word['english'],
                'Hebrew Translation': word['hebrew'],
                'Difficulty Level': str(difficulty),
                'Source': 'scrap'
            }
            new_count += 1
        else:
            dup_count += 1

    print(f"  Duplicates skipped: {dup_count}")
    print(f"  New words added: {new_count}")

    # Write updated words.csv with source column
    print("\nWriting updated words.csv...")
    fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source']

    # Sort by original order (keep band22 words first, then scrap words)
    sorted_words = sorted(existing_words.values(),
                         key=lambda x: (0 if x['Source'] == 'band22' else 1, x['English Word'].lower()))

    with open('words.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sorted_words)

    print(f"  Written {len(sorted_words)} words to words.csv")

    # Summary
    print("\n" + "="*60)
    print("MERGE COMPLETE!")
    print("="*60)
    print(f"Total words in words.csv: {len(sorted_words)}")
    print(f"  - From band22: {sum(1 for w in sorted_words if w['Source'] == 'band22')}")
    print(f"  - From scrap: {sum(1 for w in sorted_words if w['Source'] == 'scrap')}")

    # Show sample of new words added
    new_words = [w for w in sorted_words if w['Source'] == 'scrap']
    if new_words:
        print(f"\nSample of new words added from scrap.csv:")
        for word in new_words[:10]:
            print(f"  - {word['English Word']}: {word['Hebrew Translation']} (Level {word['Difficulty Level']})")

if __name__ == '__main__':
    main()
