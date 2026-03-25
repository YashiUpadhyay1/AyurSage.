from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# LOADING MODELS

dosha_model = pickle.load(open("model/best_dosha_model.pkl", "rb"))
dosha_encoder = pickle.load(open("model/label_encoder.pkl", "rb"))

disease_model = pickle.load(open("model/disease_model.pkl", "rb"))
disease_encoder = pickle.load(open("model/disease_label_encoder.pkl", "rb"))


# CSV dataset for treatment lookup

dataset = pd.read_csv("Dataset/Ayurvedic_ML_Dataset_3000_Records.csv")
dataset = dataset.fillna("Unknown")


# PREDICTION FUNCTION

def predict_ayurveda(input_dict):

    input_df = pd.DataFrame([input_dict])

    # DOSHA PREDICTION
    dosha_encoded = dosha_model.predict(input_df)
    predicted_dosha = dosha_encoder.inverse_transform(dosha_encoded)[0]

    dosha_probs = dosha_model.predict_proba(input_df)[0]

    if max(dosha_probs) < 0.5:
        return {
            "error": "Low confidence prediction. Please provide clearer symptoms."
        }

    dosha_probabilities = {
        dosha: float(prob)
        for dosha, prob in zip(dosha_encoder.classes_, dosha_probs)
    }

    # DISEASE PREDICTION
    input_df["Dosha"] = predicted_dosha

    disease_encoded = disease_model.predict(input_df)
    predicted_disease = disease_encoder.inverse_transform(disease_encoded)[0]

    

    # TREATMENT LOOKUP
    filtered = dataset[
        (dataset["Disease"] == predicted_disease) &
        (dataset["Dosha"] == predicted_dosha)
    ]

    if filtered.empty:
        filtered = dataset[dataset["Disease"] == predicted_disease]

    row = filtered.iloc[0]

    treatment = {
        "therapy": row["Therapy"],
        "medicine": row["Medicines"],
        "diet": row["Diet Plan"],
        "exercise": row["Exercise"]
    }

    return {
        "predicted_dosha": predicted_dosha,
        "dosha_probabilities": dosha_probabilities,
        "predicted_disease": predicted_disease,
        "treatment": treatment
    }


# API ROUTE


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    result = predict_ayurveda(data)
    return jsonify(result)

@app.route("/")
def home():
    return "AyurSage ML Server Running"

if __name__ == "__main__":
    app.run(port=5001)