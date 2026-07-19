"""
=============================================================================
Toxicity Model Training Script: python_ml/train_toxicity.py
=============================================================================
"""

import os
import re
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    filtered_words = [w for w in words if w not in ENGLISH_STOP_WORDS]
    return " ".join(filtered_words)

def train_toxicity_model():
    csv_file = "toxicity_data.csv"
    if not os.path.exists(csv_file):
        print(f"Dataset '{csv_file}' not found. Generating sample data...")
        from generate_sample_data import generate_datasets
        generate_datasets()

    print("\n--- Starting Toxicity Detection Model Training ---")
    df = pd.read_csv(csv_file)
    print(f"Dataset loaded: {len(df)} rows.")

    df['cleaned_text'] = df['text'].apply(clean_text)

    X = df['cleaned_text']
    y = df['is_toxic'].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    y_pred = model.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, pos_label=1)
    rec = recall_score(y_test, y_pred, pos_label=1)
    f1 = f1_score(y_test, y_pred, pos_label=1)
    cm = confusion_matrix(y_test, y_pred, labels=[1, 0])

    print("\n================ TOXICITY MODEL EVALUATION ================")
    print(f" Accuracy  : {acc:.4f} ({acc*100:.2f}%)")
    print(f" Precision : {prec:.4f}")
    print(f" Recall    : {rec:.4f}")
    print(f" F1-Score  : {f1:.4f}")
    print(" Confusion Matrix [Labels: 1 (Toxic), 0 (Non-Toxic)]:")
    print(cm)
    print("===========================================================\n")

    joblib.dump(model, "toxicity_model.pkl")
    joblib.dump(vectorizer, "toxicity_vectorizer.pkl")
    print("Successfully saved toxicity_model.pkl and toxicity_vectorizer.pkl!")

if __name__ == "__main__":
    train_toxicity_model()
