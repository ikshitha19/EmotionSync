# EmotionSync 🧠
**Emotion-Adaptive Mental Wellness Platform**

EmotionSync is a full-stack web app that detects your emotional state from natural language input and provides adaptive AI-persona support, ambient music, relaxation games, and session analytics. Built with React + Vite (frontend) and Django REST Framework (backend).

---


| Module | Description |
|---|---|
| 🤖 AI Persona Chat | NLP-powered emotion detection routes you to one of 14 specialist AI agents (Anxiety Anchor, Grief Companion, Joy Amplifier, etc.) |
| 📊 Mental Analytics | Persistent session history with emotional composition pie charts and topic trigger bar charts |
| 🎵 Ambient Sanctuary | Floating music player with 12 curated royalty-free ambient tracks |
| 👥 Anonymous Peer | Simulated anonymous peer matching with toxicity filter (prototype) |
| 🎮 Zen Sandbox | 5 grounding mini-games: 4-7-8 breathing, pop-it, memory match, starry canvas, focus dot |
| 🌐 Multilingual | English and Telugu (తెలుగు) support with real-time translation via deep-translator |

---

## Tech Stack

**Frontend:** React 19, Vite 7, Recharts, Lucide React, Web Speech API  
**Backend:** Django 6, Django REST Framework, TextBlob, deep-translator  
**Database:** SQLite (dev)

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Clone the repo
```bash
git clone https://github.com/your-username/EmotionSync.git
cd EmotionSync
```

### 2. Frontend setup
```bash
npm install

# Copy the env template and set your API URL
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000

npm run dev
# Runs at http://localhost:5173
```

### 3. Backend setup
```bash
cd backend
pip install django djangorestframework django-cors-headers textblob deep-translator

# Download TextBlob corpora
python -m textblob.download_corpora

python manage.py migrate
python manage.py runserver
# Runs at http://localhost:8000
```

---

## Project Structure

```
EmotionSync/
├── src/
│   ├── components/
│   │   ├── AiChat.jsx              # AI persona chat with voice input & crisis detection
│   │   ├── AnalyticsDashboard.jsx  # Session history charts (persisted to localStorage)
│   │   ├── Dashboard.jsx           # Main mode-selection hub
│   │   ├── Login.jsx               # Auth UI with password strength meter
│   │   ├── PeerChat.jsx            # Anonymous peer chat (prototype)
│   │   └── RelaxationGames.jsx     # 5 grounding mini-games
│   ├── utils/
│   │   ├── api.js                  # Centralised API fetch utility (reads VITE_API_URL)
│   │   ├── emotionEngine.js        # Single source of truth: agents + client-side NLP
│   │   └── translations.js         # EN / HI / TE string table
│   ├── App.jsx                     # Root: routing, music player, analytics persistence
│   └── index.css                   # Global theme variables, glassmorphism, animations
├── backend/
│   ├── api/
│   │   ├── models.py               # DB models (expandable for user sessions)
│   │   ├── views.py                # AnalyzeEmotionView REST endpoint
│   │   ├── nlp_engine.py           # TextBlob + keyword NLP + agent response generator
│   │   └── urls.py                 # /api/analyze route
│   └── backend_core/
│       └── settings.py             # Django config (CORS, installed apps)
├── .env.example                    # Environment variable template
└── README.md
```

---

## Known Limitations (Prototype)

- **Authentication is mocked** — any password is accepted. No JWT or session tokens.
- **Peer Chat is simulated** — no real WebSocket server; peer count is randomised for demo.
- **No user accounts or cloud sync** — analytics persist to `localStorage` only.

---

## API Endpoint

```
POST /api/analyze
Content-Type: application/json

{
  "text": "I feel really overwhelmed with work",
  "chatHistory": [...],
  "activeAgent": "calm",
  "language": "en"
}
```

**Response:**
```json
{
  "stats": {
    "emotion": "Stress",
    "intensity": "High",
    "confidence": 87.4,
    "insight": "You seem to be experiencing high levels of stress related to your work.",
    "topic": "work",
    "recommendedAgentId": "calm"
  },
  "response": "That sounds overwhelming. Work environments can place so much pressure on us. ...",
  "currentAgent": "calm"
}
```

---

## Crisis Safety

EmotionSync detects crisis keywords and immediately surfaces the **988 Suicide & Crisis Lifeline** overlay. This app is **not** a substitute for professional mental health care.
