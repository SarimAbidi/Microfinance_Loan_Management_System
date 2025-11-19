import pandas as pd
from sklearn.linear_model import LogisticRegression
import pickle
import os

MODEL_PATH = "risk_model.pkl"


def train_model():
    
    data = {
        "income": [30000, 50000, 20000, 70000, 15000],
        "past_defaults": [0, 0, 1, 0, 1],
        "loan_amount": [10000, 20000, 5000, 25000, 3000],
        "risk": [0, 0, 1, 0, 1]
    }

    df = pd.DataFrame(data)

    X = df[["income", "past_defaults", "loan_amount"]]
    y = df["risk"]

    model = LogisticRegression()
    model.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)


def predict_risk():
    if not os.path.exists(MODEL_PATH):
        train_model()

    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    import random
    income = random.randint(10000, 50000)
    past_defaults = random.randint(0, 1)
    loan_amount = random.randint(5000, 20000)

    pred = model.predict([[income, past_defaults, loan_amount]])[0]

    return "High" if pred == 1 else "Low"
