# Text Intelligence Platform ⚡ (Capstone 5-Member Team Edition)

An enterprise-grade monorepo project featuring **6-in-1 Parallel AI Microservices**, MERN Stack Architecture (MongoDB, Express, React, Node), and 5 dedicated team modules.

---

## 👥 5-Member Team Module Division & Ownership

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MERN STACK MONOREPO                                    │
└──────┬───────────────────┬───────────────────┬───────────────────┬─────────────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   MEMBER 1    │   │   MEMBER 2    │   │   MEMBER 3    │   │   MEMBER 4    │   │   MEMBER 5    │
│ Emotion Engine│   │ Spam Detector │   │ Readability   │   │ Express MVC   │   │ React UI/UX   │
│   (Python)    │   │   (Python)    │   │   (Python)    │   │   Gateway     │   │ & Dashboards  │
└───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘
```

| Member | Assigned Module | Key Files Owned | Viva Presentation Topic |
|---|---|---|---|
| **Member 1** | **6-Class Emotion Recognition Engine** | `train_emotion.py`, `emotion_model.pkl` | Multi-class classification using 5,937 dataset records (`Emotion_classify_Data.csv`) |
| **Member 2** | **Spam & Phishing Risk Detector** | `train_spam.py`, `spam_model.pkl` | Security text classification identifying scams and phishing URLs |
| **Member 3** | **Readability & Complexity Calculator** | `app.py` (`/analyze/readability`) | Flesch-Kincaid grade level index calculation and word tokenization |
| **Member 4** | **Express MVC API Gateway** | `backend/server.js`, `flaskService.js`, `Review.js` | 6-in-1 parallel microservice calls using `Promise.all` and MongoDB `$facet` aggregation |
| **Member 5** | **React Component UI & Analytics** | `frontend/src/components/` | Responsive glassmorphic UI, Chart.js Doughnut visualizers, and interactive state management |

---

## 🚀 How to Run the Project

### 1. Start Python Flask AI Microservice (Terminal 1)
```bash
cd python_ml
python app.py
```
> Running on `http://127.0.0.1:5001` with 6 loaded endpoints!

### 2. Start Express Backend (Terminal 2)
```bash
cd backend
npm start
```
> Running on `http://localhost:5000`

### 3. Open Browser
Go to: **`http://localhost:5000`**

---

## 🎓 5-Member Viva Defense Script

### Member 1 (Emotion Engine):
> *"I developed the 6-Class Emotion Recognition Engine trained on 5,937 labeled comment records. Using TF-IDF vectorization and Multinomial Logistic Regression, it predicts emotions like Joy, Anger, Fear, Sadness, Surprise, and Love with 93.35% accuracy."*

### Member 2 (Spam & Phishing Detector):
> *"I implemented the Spam & Phishing Detection microservice. It analyzes incoming text for phishing URLs, scam patterns, and commercial spam using TF-IDF features and Naive Bayes probability heuristics."*

### Member 3 (Readability Calculator):
> *"I built the Readability & Text Complexity Engine. It calculates Flesch Reading Ease scores and assigns grade-level complexity rankings (e.g. Easy, Standard, Advanced) based on sentence length and syllable ratios."*

### Member 4 (Express Gateway & MongoDB):
> *"I engineered the Express.js MVC API Gateway. Using `Promise.all`, Express triggers 6 microservices concurrently in parallel. I also designed the Mongoose Schema and MongoDB `$facet` aggregation pipeline for analytics."*

### Member 5 (React Frontend & Visualizers):
> *"I built the React SPA UI using Vite, Lucide Icons, and Chart.js. It presents live system status health indicators, 6 AI report cards, and interactive Doughnut charts for sentiment, toxicity, and emotion metrics."*
