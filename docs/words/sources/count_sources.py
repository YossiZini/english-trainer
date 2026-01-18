#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Count words by source properly
"""

import csv
from collections import Counter

csv_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/words.csv'

sources = []
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sources.append(row['Source'])

counter = Counter(sources)

print("Word counts by source:")
for source, count in counter.most_common():
    print(f"  {source}: {count} words")

print(f"\nTotal: {sum(counter.values())} words")
