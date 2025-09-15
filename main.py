link = {}
with open('data.tsv', 'r', encoding='utf-8') as file:
    lines = file.readlines()
    for line in lines:
        r = line.split('\t', 3)
        idx, cat = r[0], r[1]
        link[cat.lower()] = idx

import json

with open('link.json', 'w', encoding='utf-8') as file:
    json.dump(link, file)