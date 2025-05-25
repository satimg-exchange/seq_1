import json

# Load the large JSON file (ensure it's structured as an array of objects)
with open("transactions.json", "r", encoding="utf-8") as infile:
    data = json.load(infile)

# Write each object as a separate line in the NDJSON file.
with open("transactions.ndjson", "w", encoding="utf-8") as outfile:
    for record in data:
        json.dump(record, outfile)
        outfile.write("\n")
