"""
=============================================================================
Emotion Recognition Model Training Script: python_ml/train_emotion.py
=============================================================================
Trains 6-Class Emotion Classifier on 416,000-record dataset (text.csv / Emotion_classify_Data.csv)
Emotions: Joy, Sadness, Anger, Fear, Love, Surprise
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

# Emotion Label Mapping for numerical dataset (0-5)
LABEL_MAP = {
    0: 'sadness',
    1: 'joy',
    2: 'love',
    3: 'anger',
    4: 'fear',
    5: 'surprise'
}

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    filtered_words = [w for w in words if w not in ENGLISH_STOP_WORDS]
    return " ".join(filtered_words)

def train_emotion_model():
    csv_file = None
    possible_files = ["../text.csv", "text.csv", "../Emotion_classify_Data.csv", "Emotion_classify_Data.csv"]
    for f in possible_files:
        if os.path.exists(f):
            csv_file = f
            break

    if not csv_file:
        csv_file = "emotion_data.csv"

    print(f"\n--- Starting 6-Class Emotion Model Training on Dataset: '{csv_file}' ---")
    df = pd.read_csv(csv_file)
    print(f"Dataset loaded: {len(df)} rows.")

    # Identify text and label columns
    if 'text' in df.columns:
        text_col = 'text'
    elif 'Comment' in df.columns:
        text_col = 'Comment'
    else:
        text_col = df.columns[0]

    if 'label' in df.columns:
        label_col = 'label'
    elif 'Emotion' in df.columns:
        label_col = 'Emotion'
    else:
        label_col = df.columns[1]

    # Handle numerical labels (0-5)
    if pd.api.types.is_numeric_dtype(df[label_col]):
        print("Mapping numerical emotion labels (0=sadness, 1=joy, 2=love, 3=anger, 4=fear, 5=surprise)...")
        df['mapped_label'] = df[label_col].map(LABEL_MAP)
    else:
        df['mapped_label'] = df[label_col].str.lower()

    print("Preprocessing text data...")
    df['cleaned_text'] = df[text_col].apply(clean_text)

    X = df['cleaned_text']
    y = df['mapped_label']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Extracting N-Gram TF-IDF Features (ngram_range=(1,2), max_features=10000)...")
    vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1,2))
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"TF-IDF Feature Matrix Shape: {X_train_tfidf.shape}")

    print("Training Logistic Regression Model on 416,000 emotion records...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    y_pred = model.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted')
    rec = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')

    print("\n================ EMOTION MODEL EVALUATION ================")
    print(f" Dataset   : {csv_file} ({len(df)} records)")
    print(f" Classes   : {list(model.classes_)}")
    print(f" Accuracy  : {acc:.4f} ({acc*100:.2f}%)")
    print(f" Precision : {prec:.4f}")
    print(f" Recall    : {rec:.4f}")
    print(f" F1-Score  : {f1:.4f}")
    print("==========================================================\n")

    joblib.dump(model, "emotion_model.pkl")
    joblib.dump(vectorizer, "emotion_vectorizer.pkl")
    print("Successfully saved emotion_model.pkl and emotion_vectorizer.pkl!")

if __name__ == "__main__":
    train_emotion_model()
