#!/usr/bin/env python3
"""
Final 14 translations
"""

import csv

# Final 14 translations
FINAL_TRANSLATIONS = {
    'point out sth / point sth out': 'להצביע על משהו',
    'relate(d) to sb/sth': 'להזדהות עם / קשור ל',
    'set out / set out sth / set sth out': 'לצאת לדרך / להציג',
    'sum up sth/sb / sum sth/sb up': 'לסכם משהו/מישהו',
    'take advantage of sth/sbd': 'לנצל משהו/מישהו',
    'take back sth / take sth back': 'להחזיר משהו / לחזור בו',
    'take on sb/take sb on / take on sth / take sth on': 'לקבל מישהו / לקחת על עצמו משהו',
    'take over sth/take sth over': 'להשתלט על משהו',
    'take up sth/take sth up': 'לתפוס מקום / להתחיל עם',
    'think over sth or think sth over': 'לשקול משהו',
    'to some extent/to a certain extent': 'במידה מסוימת',
    'turn down sb/sth / turn sb/sth down': 'לדחות מישהו/משהו',
    'up to date / out of date': 'עדכני / לא עדכני',
    'write sth down or write down sth': 'לרשום משהו',
}

def main():
    print("Applying final 14 translations...")

    # Load words.csv
    words_list = []
    translated_count = 0

    with open('words.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if '[TO TRANSLATE]' in row.get('Hebrew Translation', ''):
                english = row['English Word']

                if english in FINAL_TRANSLATIONS:
                    row['Hebrew Translation'] = FINAL_TRANSLATIONS[english]
                    translated_count += 1

            words_list.append(row)

    # Write updated words.csv
    print("Writing updated words.csv...")
    fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']

    with open('words.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(words_list)

    # Count remaining
    remaining = sum(1 for row in words_list if '[TO TRANSLATE]' in row.get('Hebrew Translation', ''))

    print(f"\nFinal Results:")
    print(f"  Translated: {translated_count} words")
    print(f"  Still need translation: {remaining} words")
    print(f"  Total words in words.csv: {len(words_list)}")

if __name__ == '__main__':
    main()
