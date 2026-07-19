"""
=============================================================================
Sentiment Model Training Script: python_ml/train_sentiment.py
=============================================================================
Trains on the 50,000 IMDB Movie Reviews Dataset with N-Gram features
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

def train_sentiment_model():
    if os.path.exists("../IMDB Dataset.csv"):
        csv_file = "../IMDB Dataset.csv"
    elif os.path.exists("IMDB Dataset.csv"):
        csv_file = "IMDB Dataset.csv"
    else:
        csv_file = "sentiment_data.csv"

    if not os.path.exists(csv_file):
        print(f"Dataset '{csv_file}' not found. Generating sample data...")
        from generate_sample_data import generate_datasets
        generate_datasets()

    print(f"\n--- Starting Sentiment Model Training on Dataset: '{csv_file}' ---")
    df = pd.read_csv(csv_file)
    print(f"Dataset loaded: {len(df)} rows.")

    if 'review' not in df.columns and 'text' in df.columns:
        df['review'] = df['text']

    print("Preprocessing text data...")
    df['cleaned_review'] = df['review'].apply(clean_text)

    X = df['cleaned_review']
    y = df['sentiment']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Extracting N-Gram TF-IDF Features (ngram_range=(1,2), max_features=10000)...")
    vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1,2))
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"TF-IDF Feature Matrix Shape: {X_train_tfidf.shape}")

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    y_pred = model.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, pos_label="positive")
    rec = recall_score(y_test, y_pred, pos_label="positive")
    f1 = f1_score(y_test, y_pred, pos_label="positive")
    cm = confusion_matrix(y_test, y_pred, labels=["positive", "negative"])

    print("\n================ MODEL EVALUATION METRICS ================")
    print(f" Dataset   : {csv_file} ({len(df)} records)")
    print(f" Accuracy  : {acc:.4f} ({acc*100:.2f}%)")
    print(f" Precision : {prec:.4f}")
    print(f" Recall    : {rec:.4f}")
    print(f" F1-Score  : {f1:.4f}")
    print(" Confusion Matrix [Labels: positive, negative]:")
    print(cm)
    print("==========================================================\n")

    joblib.dump(model, "sentiment_model.pkl")
    joblib.dump(vectorizer, "sentiment_vectorizer.pkl")
    print("Successfully saved sentiment_model.pkl and sentiment_vectorizer.pkl!")

if __name__ == "__main__":
    train_sentiment_model()
