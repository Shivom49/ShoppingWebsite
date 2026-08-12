import random
import pandas as pd

categories = [
    "smartphone",
    "laptop",
    "audio",
    "smartwatch",
    "accessory"
]

rows = []

for _ in range(1000):

    features = {
        "smartphone": 0,
        "laptop": 0,
        "audio": 0,
        "smartwatch": 0,
        "accessory": 0
    }

    pattern = random.random()

    if pattern < 0.70:

        dominant = random.choice(categories)

        for category in categories:

            if category == dominant:
                features[category] = random.randint(4, 6)
            else:
                features[category] = random.randint(0, 2)

    elif pattern < 0.90:

        dominant1, dominant2 = random.sample(categories, 2)

        for category in categories:

            if category == dominant1:
                features[category] = random.randint(3, 6)

            elif category == dominant2:
                features[category] = random.randint(2, 5)

            else:
                features[category] = random.randint(0, 2)

    else:

        for category in categories:
            features[category] = random.randint(1, 4)

    label = max(features, key=features.get)

    rows.append({
        "smartphone": features["smartphone"],
        "laptop": features["laptop"],
        "audio": features["audio"],
        "smartwatch": features["smartwatch"],
        "accessory": features["accessory"],
        "label": label
    })

df = pd.DataFrame(rows)

df.to_csv("dataset.csv", index=False)

print("Dataset generated successfully.")
print(df.head())