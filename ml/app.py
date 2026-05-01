from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Path fix for Render
base_dir = os.path.dirname(os.path.abspath(__file__))

try:
    dosha_model = pickle.load(open(os.path.join(base_dir, "model/best_dosha_model.pkl"), "rb"))
    dosha_encoder = pickle.load(open(os.path.join(base_dir, "model/label_encoder.pkl"), "rb"))
    disease_model = pickle.load(open(os.path.join(base_dir, "model/disease_model.pkl"), "rb"))
    disease_encoder = pickle.load(open(os.path.join(base_dir, "model/disease_label_encoder.pkl"), "rb"))
    
    dataset = pd.read_csv(os.path.join(base_dir, "Dataset/Ayurvedic_ML_Dataset_3000_Records.csv"))
    dataset = dataset.fillna("Unknown")
except Exception as e:
    print(f"CRITICAL: Error loading files: {e}")

def predict_ayurveda(input_dict):
    try:
        input_df = pd.DataFrame([input_dict])
        
        # --- DEBUG LOGS ---
        print("--- ML DEBUG ---")
        print("Expected:", dosha_model.feature_names_in_.tolist())
        print("Received:", input_df.columns.tolist())
        print("Types:", input_df.dtypes.to_dict())

        # Prediction
        dosha_encoded = dosha_model.predict(input_df)
        predicted_dosha = dosha_encoder.inverse_transform(dosha_encoded)[0]
        
        # Calculate disease
        input_df["Dosha"] = predicted_dosha
        disease_encoded = disease_model.predict(input_df)
        predicted_disease = disease_encoder.inverse_transform(disease_encoded)[0]

        # Lookup treatment
        filtered = dataset[(dataset["Disease"] == predicted_disease) & (dataset["Dosha"] == predicted_dosha)]
        if filtered.empty:
            filtered = dataset[dataset["Disease"] == predicted_disease]
        
        row = filtered.iloc[0]
        return {
            "predicted_dosha": predicted_dosha,
            "predicted_disease": predicted_disease,
            "treatment": {
                "therapy": row["Therapy"],
                "medicine": row["Medicines"],
                "diet": row["Diet Plan"],
                "exercise": row["Exercise"]
            }
        }
    except Exception as e:
        # Return error with details
        return {"error": str(e), "received_keys": list(input_dict.keys())}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    result = predict_ayurveda(data)
    return jsonify(result)

@app.route("/")
def home():
    return "AyurSage ML Server Live"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)