import joblib
import pandas as pd

model = joblib.load("recommendation_model.pkl")

features = pd.DataFrame([{
    "smartphone": 3,
    "laptop": 1,
    "audio": 0,
    "smartwatch": 0,
    "accessory": 0
}])

prediction = model.predict(features)

probabilities = model.predict_proba(features)

print(prediction)
print(probabilities)