import csv
import re

# Read the LexicalBand3 PDF data and create structured entries
# This script will process the vocabulary and prepare it for words.csv

def create_word_entry(english_word, pos, meaning, rec_prod, difficulty=8):
    """
    Create a word entry with Hebrew translation and example sentence
    """
    # Clean the english word
    english_word = english_word.strip()

    # Basic Hebrew translations (these would need to be properly translated)
    # For now, creating a placeholder structure
    hebrew_translation = f"[תרגום: {english_word}]"

    # Create a simple example sentence
    example_sentence = f"Example: {english_word}"

    # Source
    source = "lexisband3"

    return {
        'English Word': english_word,
        'Hebrew Translation': hebrew_translation,
        'Difficulty Level': difficulty,
        'Source': source,
        'Example Sentence': example_sentence
    }

def main():
    # Sample entries from Band III Core I
    band3_words = []

    # This is a starter - you would need to add all words from the PDF
    # Format: (word, pos, meaning, rec_prod, difficulty)
    sample_words = [
        ("absorb", "v", "soak up", "Rec", 8),
        ("access", "n, v", "", "Rec", 8),
        ("acquire", "v", "", "Prod", 8),
        ("advance", "n", "progress", "Rec", 8),
        # Add more words here...
    ]

    for word_data in sample_words:
        english_word, pos, meaning, rec_prod, difficulty = word_data
        entry = create_word_entry(english_word, pos, meaning, rec_prod, difficulty)
        band3_words.append(entry)

    # Write to a temporary CSV file
    output_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/band3_processed.csv'

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        for entry in band3_words:
            writer.writerow(entry)

    print(f"Processed {len(band3_words)} words")
    print(f"Output written to: {output_file}")

if __name__ == "__main__":
    main()
