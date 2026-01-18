#!/usr/bin/env python3
"""
Script to merge Band33july18.csv into words.csv
"""

import csv
import re
from collections import defaultdict

def normalize_word(word):
    """Extract base word from complex entries like 'word1, word2' or 'word, adj'"""
    # Remove quotes
    word = word.strip('"').strip()
    # Split by comma and take first item
    if ',' in word:
        word = word.split(',')[0].strip()
    return word.lower()

def clean_word_for_display(word):
    """Clean word but keep it in its original form for display"""
    return word.strip('"').strip()

def extract_words_from_lexical_item(lexical_item):
    """Extract individual words from lexical items like 'word1, word2, word3'"""
    # Remove quotes
    lexical_item = lexical_item.strip('"').strip()
    # Split by comma
    words = [w.strip() for w in lexical_item.split(',')]
    return words

def determine_difficulty(word, pos, example):
    """
    Determine difficulty level based on word characteristics
    Band 3 words are typically intermediate to advanced (6-8)
    """
    word_lower = word.lower()

    # Very common words should be easier
    very_common = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'have', 'has', 'had', 'do', 'does', 'did']
    if word_lower in very_common:
        return 4

    # Simple, short words tend to be easier
    if len(word) <= 4:
        return 6
    elif len(word) <= 6:
        return 7
    else:
        # Longer words from Band 3 are typically more advanced
        return 8

def get_hebrew_placeholder(word):
    """Return a placeholder for Hebrew translation"""
    return "[TO TRANSLATE]"

def main():
    # Read existing words.csv
    print("Reading existing words.csv...")
    existing_words = {}
    words_list = []

    with open('/Users/Yossi.Zini/development/eng-tu/docs/words/words.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            words_list.append(row)
            normalized = normalize_word(row['English Word'])
            existing_words[normalized] = row

    print(f"Found {len(words_list)} existing words")

    # Read Band33july18.csv
    print("Reading Band33july18.csv...")
    new_words = []
    updated_words = []

    with open('/Users/Yossi.Zini/development/eng-tu/docs/words/sources/Band33july18.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            lexical_item = row['Lexical Item']
            pos = row['Part of Speech']
            example = row['Example']

            # Skip empty rows
            if not lexical_item:
                continue

            # Extract all words from the lexical item
            words = extract_words_from_lexical_item(lexical_item)

            for word in words:
                word = word.strip()
                if not word:
                    continue

                normalized = normalize_word(word)

                # Check if word already exists
                if normalized in existing_words:
                    # Update source to include band33july18 if not already there
                    existing_row = existing_words[normalized]
                    sources = existing_row.get('Source', '')
                    if 'band33july18' not in sources:
                        if sources:
                            existing_row['Source'] = sources + ',band33july18'
                        else:
                            existing_row['Source'] = 'band33july18'

                        # Update example if current one is better (longer/more informative)
                        if example and (not existing_row.get('Example Sentence') or
                                       len(example) > len(existing_row.get('Example Sentence', ''))):
                            existing_row['Example Sentence'] = example

                        updated_words.append(normalized)
                else:
                    # Add as new word
                    difficulty = determine_difficulty(word, pos, example)
                    new_row = {
                        'English Word': word,
                        'Hebrew Translation': get_hebrew_placeholder(word),
                        'Difficulty Level': str(difficulty),
                        'Source': 'band33july18',
                        'Example Sentence': example if example else ''
                    }
                    words_list.append(new_row)
                    existing_words[normalized] = new_row
                    new_words.append(word)

    print(f"Added {len(new_words)} new words")
    print(f"Updated {len(updated_words)} existing words")

    # Sort words alphabetically by English Word
    words_list.sort(key=lambda x: x['English Word'].lower())

    # Write back to words.csv
    print("Writing merged data to words.csv...")
    fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']

    with open('/Users/Yossi.Zini/development/eng-tu/docs/words/words.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(words_list)

    print("Done!")
    print(f"\nSummary:")
    print(f"  Total words in merged file: {len(words_list)}")
    print(f"  New words added: {len(new_words)}")
    print(f"  Existing words updated: {len(updated_words)}")
    print(f"\nNext steps:")
    print(f"  1. Review words with '[TO TRANSLATE]' placeholder")
    print(f"  2. Add Hebrew translations for new words")
    print(f"  3. Adjust difficulty levels if needed")

if __name__ == '__main__':
    main()
