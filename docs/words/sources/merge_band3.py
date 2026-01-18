#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Merge LexicalBand3 vocabulary into words.csv
"""

import csv
import os

def merge_vocabulary():
    """Merge Band III vocabulary into main words.csv"""

    # File paths
    source_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/LexicalBand3_processed.csv'
    target_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/words.csv'
    backup_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/words_backup.csv'

    # Read existing words
    existing_words = {}
    with open(target_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Use English word as key (lowercase for comparison)
            key = row['English Word'].lower().strip()
            existing_words[key] = row

    print(f"✓ Read {len(existing_words)} existing words")

    # Read new words from Band III
    new_words = []
    duplicates = []
    with open(source_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = row['English Word'].lower().strip()
            if key in existing_words:
                duplicates.append(row['English Word'])
            else:
                new_words.append(row)

    print(f"✓ Found {len(new_words)} new words to add")
    print(f"✓ Found {len(duplicates)} duplicates (will skip)")

    if duplicates:
        print(f"\nDuplicates (first 10): {', '.join(duplicates[:10])}")

    # Create backup
    import shutil
    shutil.copy2(target_file, backup_file)
    print(f"✓ Created backup: {backup_file}")

    # Merge: append new words to existing
    all_words = list(existing_words.values()) + new_words

    # Write merged file
    with open(target_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        for word in all_words:
            writer.writerow(word)

    print(f"\n✓ Merged successfully!")
    print(f"✓ Total words in words.csv: {len(all_words)}")
    print(f"✓ Added {len(new_words)} new words from LexicalBand3")

if __name__ == "__main__":
    merge_vocabulary()
