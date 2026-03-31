import pandas as pd
import json

# 1️⃣ Load CSV
csv_file = "fertilizerPrediction.csv"  # ensure the file is in the same folder
df = pd.read_csv(csv_file)

# 2️⃣ Convert to JSON
json_data = df.to_dict(orient="records")

# 3️⃣ Save to file
with open("fertilizerPrediction.json", "w") as f:
    json.dump(json_data, f, indent=4)

print("CSV successfully converted to JSON!")