"""
=============================================================================
Flask Machine Learning Prediction Microservice: python_ml/app.py
=============================================================================
High-precision multi-service microservice API.
=============================================================================
"""

import os
import re
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS

app = Flask(__name__)
CORS(app)

sentiment_model = None
sentiment_vectorizer = None
toxicity_model = None
toxicity_vectorizer = None
emotion_model = None
emotion_vectorizer = None
spam_model = None
spam_vectorizer = None

PROFANITY_WORDS = {'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'crap', 'bullshit', 'dick', 'pussy', 'damn', 'slut', 'whore'}
CUSTOM_STOP_WORDS = set(ENGLISH_STOP_WORDS).union({
  'hi', 'there', 'was', 'yeah', 'kinda', 'kind', 'so', 'too', 'just', 'like', 'um', 'really', 'very'
})

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    filtered = [w for w in words if w not in ENGLISH_STOP_WORDS]
    return " ".join(filtered) if filtered else text.lower()

def contains_profanity(text):
    words = set(re.findall(r'\b\w+\b', text.lower()))
    return bool(words.intersection(PROFANITY_WORDS))

def is_spam_pattern(text):
    """Detects phishing URLs, financial scam patterns, and commercial spam."""
    t = text.lower()
    spam_signals = [
        r'http[s]?://', r'bit\.ly', r'claim now', r'won a', r'free gift', r'cash lottery',
        r'urgent', r'click here', r'verify your bank', r'account suspended', r'lottery'
    ]
    for pattern in spam_signals:
        if re.search(pattern, t):
            return True
    return False

def get_artifact_path(filename):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if os.path.exists(filename):
        return filename
    path_in_script_dir = os.path.join(script_dir, filename)
    if os.path.exists(path_in_script_dir):
        return path_in_script_dir
    return filename

def load_ml_artifacts():
    global sentiment_model, sentiment_vectorizer, toxicity_model, toxicity_vectorizer
    global emotion_model, emotion_vectorizer, spam_model, spam_vectorizer

    print("\n--- Loading Microservice ML Artifacts into Flask Memory ---")

    try:
        sentiment_model = joblib.load(get_artifact_path("sentiment_model.pkl"))
        sentiment_vectorizer = joblib.load(get_artifact_path("sentiment_vectorizer.pkl"))
        print("✓ Sentiment model loaded.")
    except Exception as e:
        print(f"⚠️ Warning loading sentiment model: {e}")

    try:
        toxicity_model = joblib.load(get_artifact_path("toxicity_model.pkl"))
        toxicity_vectorizer = joblib.load(get_artifact_path("toxicity_vectorizer.pkl"))
        print("✓ Toxicity model loaded.")
    except Exception as e:
        print(f"⚠️ Warning loading toxicity model: {e}")

    try:
        emotion_model = joblib.load(get_artifact_path("emotion_model.pkl"))
        emotion_vectorizer = joblib.load(get_artifact_path("emotion_vectorizer.pkl"))
        print("✓ Emotion model loaded.")
    except Exception as e:
        print(f"⚠️ Warning loading emotion model: {e}")

    try:
        spam_model = joblib.load(get_artifact_path("spam_model.pkl"))
        spam_vectorizer = joblib.load(get_artifact_path("spam_vectorizer.pkl"))
        print("✓ Spam model loaded.")
    except Exception as e:
        print(f"⚠️ Warning loading spam model: {e}")

load_ml_artifacts()

# -----------------------------------------------------------------------------
# 1. Sentiment Endpoint
# -----------------------------------------------------------------------------
@app.route('/predict/sentiment', methods=['POST'])
def predict_sentiment():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "Missing 'text' field."}), 400

    if sentiment_model is None or sentiment_vectorizer is None:
        return jsonify({"error": "Sentiment model not loaded."}), 500

    try:
        if contains_profanity(text):
            return jsonify({"sentiment": "negative", "confidence": 0.98}), 200

        cleaned = clean_text(text)
        tfidf = sentiment_vectorizer.transform([cleaned])

        if tfidf.nnz == 0:
            positive_signals = {'good', 'great', 'awesome', 'nice', 'love', 'cool', 'excellent'}
            negative_signals = {'bad', 'terrible', 'worst', 'horrible', 'poor', 'awful'}
            words = set(re.findall(r'\w+', text.lower()))
            if words.intersection(negative_signals):
                return jsonify({"sentiment": "negative", "confidence": 0.75}), 200
            elif words.intersection(positive_signals):
                return jsonify({"sentiment": "positive", "confidence": 0.75}), 200

        pred = sentiment_model.predict(tfidf)[0]
        probs = sentiment_model.predict_proba(tfidf)[0]
        idx = {cls: i for i, cls in enumerate(sentiment_model.classes_)}
        confidence = float(probs[idx[pred]])

        return jsonify({"sentiment": str(pred), "confidence": round(confidence, 4)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------------------------
# 2. Toxicity Endpoint
# -----------------------------------------------------------------------------
@app.route('/predict/toxicity', methods=['POST'])
def predict_toxicity():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "Missing 'text' field."}), 400

    if toxicity_model is None or toxicity_vectorizer is None:
        return jsonify({"error": "Toxicity model not loaded."}), 500

    try:
        if contains_profanity(text):
            return jsonify({"toxic": True, "confidence": 0.99}), 200

        cleaned = clean_text(text)
        tfidf = toxicity_vectorizer.transform([cleaned])

        if tfidf.nnz == 0:
            return jsonify({"toxic": False, "confidence": 0.95}), 200

        pred_cls = int(toxicity_model.predict(tfidf)[0])
        is_toxic = bool(pred_cls == 1)
        probs = toxicity_model.predict_proba(tfidf)[0]
        idx = {cls: i for i, cls in enumerate(toxicity_model.classes_)}
        confidence = float(probs[idx[pred_cls]])

        return jsonify({"toxic": is_toxic, "confidence": round(confidence, 4)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------------------------
# 3. Emotion Recognition Endpoint
# -----------------------------------------------------------------------------
@app.route('/predict/emotion', methods=['POST'])
def predict_emotion():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "Missing 'text' field."}), 400

    if emotion_model is None or emotion_vectorizer is None:
        return jsonify({"error": "Emotion model not loaded."}), 500

    try:
        cleaned = clean_text(text)
        tfidf = emotion_vectorizer.transform([cleaned])

        if tfidf.nnz == 0:
            words = set(re.findall(r'\w+', text.lower()))
            if words.intersection({'hate', 'angry', 'furious', 'annoyed'}):
                top_emotion = 'anger'
            elif words.intersection({'sad', 'lonely', 'depressed', 'cry'}):
                top_emotion = 'sadness'
            elif words.intersection({'scared', 'afraid', 'terrified', 'fear'}):
                top_emotion = 'fear'
            elif words.intersection({'love', 'adore', 'sweet'}):
                top_emotion = 'love'
            elif words.intersection({'wow', 'surprised', 'shock'}):
                top_emotion = 'surprise'
            else:
                top_emotion = 'joy'
            
            return jsonify({
                "emotion": top_emotion,
                "confidence": 0.75,
                "scores": {top_emotion: 0.75}
            }), 200

        pred = str(emotion_model.predict(tfidf)[0]).lower()
        probs = emotion_model.predict_proba(tfidf)[0]

        scores = {}
        for cls, prob in zip(emotion_model.classes_, probs):
            scores[str(cls).lower()] = round(float(prob), 4)

        top_confidence = scores.get(pred, 0.85)

        return jsonify({
            "emotion": pred,
            "confidence": top_confidence,
            "scores": scores
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------------------------
# 4. Spam & Phishing Risk Endpoint
# -----------------------------------------------------------------------------
@app.route('/predict/spam', methods=['POST'])
def predict_spam():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "Missing 'text' field."}), 400

    try:
        # High precision spam pattern override (URLs, scam keywords)
        if is_spam_pattern(text):
            return jsonify({"isSpam": True, "confidence": 0.99}), 200

        if spam_model is not None and spam_vectorizer is not None:
            cleaned = clean_text(text)
            tfidf = spam_vectorizer.transform([cleaned])

            if tfidf.nnz > 0:
                pred = str(spam_model.predict(tfidf)[0]).lower()
                is_spam = bool(pred == 'spam')
                probs = spam_model.predict_proba(tfidf)[0]
                idx = {cls: i for i, cls in enumerate(spam_model.classes_)}
                confidence = float(probs[idx[pred]])
                return jsonify({"isSpam": is_spam, "confidence": round(confidence, 4)}), 200

        return jsonify({"isSpam": False, "confidence": 0.95}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------------------------
# 5. Keyword Extraction Endpoint
# -----------------------------------------------------------------------------
@app.route('/extract/keywords', methods=['POST'])
def extract_keywords():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "Missing 'text' field."}), 400

    try:
        raw_words = re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())
        meaningful_words = [w for w in raw_words if w not in CUSTOM_STOP_WORDS]

        seen = []
        for w in meaningful_words:
            if w not in seen:
                seen.append(w)

        if not seen:
            seen = list(dict.fromkeys(raw_words))

        return jsonify({"keywords": seen[:5]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------------------------
# 6. Readability & Complexity Endpoint
# -----------------------------------------------------------------------------
@app.route('/analyze/readability', methods=['POST'])
def analyze_readability():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "Missing 'text' field."}), 400

    try:
        words = text.split()
        sentences = [s for s in re.split(r'[.!?]+', text) if s.strip()]

        word_count = len(words)
        char_count = len(text)
        sentence_count = max(len(sentences), 1)

        avg_words_per_sentence = word_count / sentence_count
        reading_ease = round(206.835 - (1.015 * avg_words_per_sentence) - 10.0, 1)
        reading_ease = max(min(reading_ease, 100.0), 0.0)

        if reading_ease >= 80:
            grade_level = "Easy (5th-6th Grade)"
        elif reading_ease >= 60:
            grade_level = "Standard (8th-9th Grade)"
        elif reading_ease >= 40:
            grade_level = "Advanced (High School)"
        else:
            grade_level = "Complex (College / Professional)"

        return jsonify({
            "wordCount": word_count,
            "charCount": char_count,
            "sentenceCount": sentence_count,
            "readingEase": reading_ease,
            "gradeLevel": grade_level
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "Python Flask ML Microservice",
        "models_loaded": {
            "sentiment": sentiment_model is not None,
            "toxicity": toxicity_model is not None,
            "emotion": emotion_model is not None,
            "spam": spam_model is not None
        }
    }), 200

if __name__ == '__main__':
    print("Starting Flask microservice on http://127.0.0.1:5001 ...")
    app.run(host='0.0.0.0', port=5001, debug=True)
