"""
=============================================================================
Spam & Phishing Detection Model Training Script: python_ml/train_spam.py
=============================================================================
Trains binary Classifier for Spam vs Legitimate message classification.
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

def train_spam_model():
    csv_file = "spam_data.csv"
    if os.path.exists("spam.csv"):
        csv_file = "spam.csv"
    elif os.path.exists("../spam.csv"):
        csv_file = "../spam.csv"

    if not os.path.exists(csv_file):
        print(f"Dataset '{csv_file}' not found. Generating sample spam & ham dataset...")
        sample_data = [
            ("URGENT! You have won a $1000 Walmart Gift Card. Claim now at http://bit.ly/claim123", "spam"),
            ("CONGRATS! You have been selected for a free iPhone 15. Click http://scam.link to claim!", "spam"),
            ("Click here immediately to verify your bank account details or account will be suspended!", "spam"),
            ("Earn $5000 a week working from home! No experience needed. Contact fast!", "spam"),
            ("Congratulations user! You won 1st prize in cash lottery. Call 1-800-SPAM-NOW", "spam"),
            ("Hi John, can we reschedule our project sync to 3 PM tomorrow?", "ham"),
            ("Please review the attached invoice for last month services.", "ham"),
            ("Hey, hope you are doing well! Let us catch up over lunch.", "ham"),
            ("The meeting notes have been updated in the shared document folder.", "ham"),
            ("Could you please send over the latest quarterly report when ready?", "ham")
        ] * 30
        df = pd.DataFrame(sample_data, columns=["text", "label"])
        df.to_csv("spam_data.csv", index=False)
        csv_file = "spam_data.csv"

    print(f"\n--- Starting Spam & Phishing Model Training on Dataset: '{csv_file}' ---")
    df = pd.read_csv(csv_file)
    print(f"Dataset loaded: {len(df)} rows.")

    text_col = 'text' if 'text' in df.columns else df.columns[0]
    label_col = 'label' if 'label' in df.columns else df.columns[1]

    print("Preprocessing text data...")
    df['cleaned_text'] = df[text_col].apply(clean_text)

    X = df['cleaned_text']
    y = df[label_col].str.lower()

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
    prec = precision_score(y_test, y_pred, pos_label="spam")
    rec = recall_score(y_test, y_pred, pos_label="spam")
    f1 = f1_score(y_test, y_pred, pos_label="spam")
    cm = confusion_matrix(y_test, y_pred, labels=["spam", "ham"])

    print("\n================ SPAM MODEL EVALUATION ================")
    print(f" Accuracy  : {acc:.4f} ({acc*100:.2f}%)")
    print(f" Precision : {prec:.4f}")
    print(f" Recall    : {rec:.4f}")
    print(f" F1-Score  : {f1:.4f}")
    print(" Confusion Matrix [Labels: spam, ham]:")
    print(cm)
    print("=======================================================\n")

    joblib.dump(model, "spam_model.pkl")
    joblib.dump(vectorizer, "spam_vectorizer.pkl")
    print("Successfully saved spam_model.pkl and spam_vectorizer.pkl!")

if __name__ == "__main__":
    train_spam_model()
