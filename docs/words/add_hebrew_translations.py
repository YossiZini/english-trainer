#!/usr/bin/env python3
"""
Script to add Hebrew translations from LexicalBand3_processed.csv
to words that need translation
"""

import csv
import re

def normalize_word(word):
    """Normalize word for matching"""
    # Remove special characters, lowercase
    word = word.lower().strip()
    word = re.sub(r'[^\w\s-]', '', word)
    return word

def main():
    print("Loading Hebrew translations from LexicalBand3_processed.csv...")

    # Load reference translations
    reference_translations = {}
    with open('sources/LexicalBand3_processed.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            english = row['English Word']
            hebrew = row['Hebrew Translation']
            normalized = normalize_word(english)
            if hebrew and hebrew != '[TO TRANSLATE]':
                reference_translations[normalized] = hebrew
                # Also add the original form
                reference_translations[english.lower().strip()] = hebrew

    print(f"Loaded {len(reference_translations)} reference translations")

    # Load words.csv and update translations
    print("Updating words.csv with translations...")
    words_list = []
    matched_count = 0
    still_need_translation = 0

    with open('words.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if '[TO TRANSLATE]' in row.get('Hebrew Translation', ''):
                english = row['English Word']
                normalized = normalize_word(english)

                # Try to find translation
                if normalized in reference_translations:
                    row['Hebrew Translation'] = reference_translations[normalized]
                    matched_count += 1
                elif english.lower().strip() in reference_translations:
                    row['Hebrew Translation'] = reference_translations[english.lower().strip()]
                    matched_count += 1
                else:
                    # Try matching first word if it's a phrase
                    first_word = english.split()[0] if ' ' in english else english
                    normalized_first = normalize_word(first_word)
                    if normalized_first in reference_translations:
                        # Use the translation but mark it as partial
                        row['Hebrew Translation'] = reference_translations[normalized_first]
                        matched_count += 1
                    else:
                        still_need_translation += 1

            words_list.append(row)

    # Write updated words.csv
    print("Writing updated words.csv...")
    fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']

    with open('words.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(words_list)

    print(f"\nDone!")
    print(f"  Matched and translated: {matched_count} words")
    print(f"  Still need translation: {still_need_translation} words")

    # Create a file with remaining words needing translation
    if still_need_translation > 0:
        remaining = [row for row in words_list if '[TO TRANSLATE]' in row.get('Hebrew Translation', '')]
        with open('remaining_translations_needed.csv', 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(remaining)
        print(f"  Created remaining_translations_needed.csv with {len(remaining)} words")

if __name__ == '__main__':
    main()
