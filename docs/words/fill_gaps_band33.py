#!/usr/bin/env python3
"""
Script to fill in gaps for Band33july18 words:
1. Assign proper difficulty levels based on word characteristics
2. Create a translation worksheet
"""

import csv
import re

# Common words that should be easier even if from Band 3
COMMON_WORDS = {
    'a.m', 'p.m', 'airport', 'bird', 'beach', 'ball', 'bar', 'bank', 'band',
    'bill', 'building', 'chicken', 'Christmas', 'church', 'college', 'egg',
    'gun', 'hill', 'horse', 'ice', 'kitchen', 'knee', 'leg', 'lips', 'nose',
    'neck', 'snow', 'sugar', 'tooth', 'wine', 'wing', 'yard', 'back', 'bone'
}

# Academic/formal words that are advanced
ADVANCED_WORDS = {
    'abstract', 'accordingly', 'acknowledge', 'acquire', 'adequately',
    'comprehensive', 'consequently', 'constitution', 'contemporary',
    'criterion', 'criteria', 'fundamental', 'hypothesis', 'infrastructure',
    'inherent', 'innovation', 'integrity', 'intervention', 'manipulation',
    'nevertheless', 'nonetheless', 'paradigm', 'phenomenon', 'preliminary',
    'protocol', 'subsidiary', 'thereby', 'whereby', 'hierarchy'
}

def assign_difficulty(word, has_example):
    """
    Assign difficulty level based on word characteristics.
    Band 3 words are generally academic/advanced (7-9 range)
    """
    word_lower = word.lower().strip()

    # Very common everyday words
    if word_lower in COMMON_WORDS:
        return 6

    # Advanced academic words
    if word_lower in ADVANCED_WORDS:
        return 9

    # Phrasal verbs and idioms are typically harder
    if ' ' in word_lower or '-' in word_lower:
        # Multi-word expressions
        if word_lower.startswith(('in ', 'on ', 'at ', 'by ', 'for ', 'with ')):
            return 8
        else:
            return 7

    # Single words
    word_len = len(word_lower)

    # Very short words
    if word_len <= 4:
        return 6
    # Short words
    elif word_len <= 6:
        return 7
    # Medium words
    elif word_len <= 9:
        return 8
    # Long words (typically more academic)
    else:
        return 9

def needs_better_example(example):
    """Check if example sentence needs improvement"""
    if not example or len(example.strip()) < 5:
        return True
    return False

def main():
    print("Processing Band33 words to fill gaps...")

    # Read words.csv
    words_list = []
    words_needing_translation = []

    with open('words.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Check if this is a band33july18 word needing translation
            if '[TO TRANSLATE]' in row.get('Hebrew Translation', ''):
                # Assign proper difficulty level
                word = row['English Word']
                example = row.get('Example Sentence', '')

                # Update difficulty level
                new_difficulty = assign_difficulty(word, bool(example))
                row['Difficulty Level'] = str(new_difficulty)

                # Track for translation worksheet
                words_needing_translation.append({
                    'English Word': word,
                    'Difficulty Level': new_difficulty,
                    'Example Sentence': example,
                    'Hebrew Translation': ''  # Empty for manual fill
                })

            words_list.append(row)

    # Write updated words.csv
    print(f"Updating difficulty levels for {len(words_needing_translation)} words...")
    fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']

    with open('words.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(words_list)

    # Create translation worksheet
    print("Creating translation worksheet...")
    with open('band33_translation_worksheet.csv', 'w', encoding='utf-8', newline='') as f:
        worksheet_fields = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Example Sentence']
        writer = csv.DictWriter(f, fieldnames=worksheet_fields)
        writer.writeheader()
        writer.writerows(words_needing_translation)

    print(f"\nDone!")
    print(f"  Updated difficulty levels in words.csv")
    print(f"  Created band33_translation_worksheet.csv with {len(words_needing_translation)} words")
    print(f"\nDifficulty distribution:")

    # Show difficulty distribution
    difficulty_counts = {}
    for word in words_needing_translation:
        level = word['Difficulty Level']
        difficulty_counts[level] = difficulty_counts.get(level, 0) + 1

    for level in sorted(difficulty_counts.keys()):
        print(f"    Level {level}: {difficulty_counts[level]} words")

if __name__ == '__main__':
    main()
