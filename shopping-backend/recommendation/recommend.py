import sys
import json
import joblib
import pandas as pd

model = joblib.load("recommendation/recommendation_model.pkl")

input_data = json.loads(sys.argv[1])
    
features = pd.DataFrame([input_data])

probabilities = model.predict_proba(features)[0]

result = {}

for category, probability in zip(model.classes_, probabilities):

    result[category] = float(probability)

print(json.dumps(result))