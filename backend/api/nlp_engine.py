import random
from textblob import TextBlob
from deep_translator import GoogleTranslator

# Mock LLM API logic
# In production, replace `mock_llm_inference` with actual `openai.ChatCompletion.create` or similar APIs.

AGENTS = [
    {'id': 'calm', 'targetEmotion': 'Stress'},
    {'id': 'listener', 'targetEmotion': 'Sadness'},
    {'id': 'coach', 'targetEmotion': 'Low Confidence'},
    {'id': 'positive', 'targetEmotion': 'Low Mood'},
    {'id': 'anchor', 'targetEmotion': 'Anxiety'},
    {'id': 'vent', 'targetEmotion': 'Anger'},
    {'id': 'companion', 'targetEmotion': 'Grief'},
    {'id': 'joy', 'targetEmotion': 'Happiness'},
    {'id': 'strategist', 'targetEmotion': 'Burnout'},
    {'id': 'clarity', 'targetEmotion': 'Confusion'},
    {'id': 'connector', 'targetEmotion': 'Loneliness'},
    {'id': 'care', 'targetEmotion': 'Exhaustion'},
    {'id': 'protector', 'targetEmotion': 'Fear'},
    {'id': 'mindful', 'targetEmotion': 'Apathy'}
]

EMOTION_KEYWORDS = {
    'Stress': ['overwhelmed', 'too much', 'stress', 'cant cope', 'busy', 'pressure', 'tense', 'pushed', 'tight', 'strained', 'exhausting', 'frantic', 'panic attack', 'deadline', 'no time', 'overloaded', 'burdensome', 'taxing', 'demanding', 'weight on my shoulders'],
    'Sadness': ['sad', 'depressed', 'crying', 'heartbroken', 'sorrow', 'hurt', 'upset', 'down', 'blue', 'miserable', 'gloomy', 'despair', 'hopeless', 'tears', 'weeping', 'unhappy', 'low', 'melancholy', 'aching', 'empty'],
    'Low Confidence': ['fail', 'useless', 'stupid', 'imposter', "can't do", 'give up', 'insecure', 'doubt', 'worthless', 'bad at', 'mistake', 'loser', 'dumb', 'inadequate', 'flawed', 'ashamed', 'shame', 'embarrassed', 'not good enough'],
    'Low Mood': ['meh', 'whatever', 'unmotivated', 'sluggish', 'lazy', 'bleh', 'blah', 'tired of', 'dull', 'stagnant', 'uninspired', 'bland', 'uninterested', 'listless', 'weary'],
    'Anxiety': ['anxious', 'panic', 'nervous', 'worried', 'dread', 'overthinking', 'racing', 'doom', 'scared', 'apprehensive', 'jittery', 'restless', 'on edge', 'uneasy', 'butterflies', 'fidgety', 'scared', 'shaking', 'terrified'],
    'Anger': ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'pissed', 'frustrated', 'irritated', 'livid', 'outrage', 'resent', 'boiling', 'infuriated', 'wrath', 'fed up', 'hostile', 'agitated', 'bitter', 'vengeful'],
    'Grief': ['grief', 'loss', 'died', 'passed away', 'mourning', 'bereavement', 'widow', 'miss them', 'gone forever', 'funeral', 'tragic', 'devastated', 'lost him', 'lost her', 'passed', 'goodbye'],
    'Happiness': ['happy', 'great', 'awesome', 'excited', 'joy', 'wonderful', 'amazing', 'best', 'thrilled', 'ecstatic', 'delighted', 'cheerful', 'upbeat', 'glad', 'fantastic', 'excellent', 'love', 'proud', 'accomplished'],
    'Burnout': ['burned out', 'quit', "can't take it", 'drained', 'fried', 'spent', 'done', 'exhausted', 'overworked', 'depleted', 'running on empty', 'zombie', 'fatigued', 'no spark', 'hollow'],
    'Confusion': ['confused', 'lost', "don't know", 'unsure', 'stuck', 'torn', 'decide', 'options', 'puzzled', 'baffled', 'perplexed', 'mixed up', 'disoriented', 'bewildered', 'clueless', 'muddled'],
    'Loneliness': ['lonely', 'isolated', 'no one', 'alone', 'abandoned', 'left out', 'ignored', 'solitary', 'friendless', 'outcast', 'lonesome', 'alienated', 'nobody', 'missing someone'],
    'Exhaustion': ['exhausted', 'tired', 'sleepy', 'fatigue', 'no energy', 'wiped out', 'lethargic', 'beat', 'dead tired', 'weary', 'drowsy', 'heavy eyes', 'burnt'],
    'Fear': ['scared', 'afraid', 'terrified', 'fear', 'threat', 'danger', 'frightened', 'horror', 'petrified', 'spooked', 'alarmed', 'panicked', 'shaking'],
    'Apathy': ['bored', 'numb', 'empty', 'nothing', 'dont care', 'indifferent', 'apathetic', 'emotionless', 'void', 'hollow', 'whatever', 'unresponsive']
}

TOPIC_KEYWORDS = {
    'work': ['work', 'boss', 'job', 'office', 'manager', 'colleagues', 'deadline', 'client', 'career', 'project', 'meeting', 'promotion', 'salary', 'co-workers', 'business', 'company', 'startup', 'employee', 'interview', 'hired'],
    'school': ['school', 'exam', 'study', 'grades', 'professor', 'college', 'homework', 'assignment', 'class', 'test', 'university', 'student', 'teacher', 'degree', 'semester', 'campus', 'lecture', 'scholarship', 'fail', 'pass'],
    'relationships': ['partner', 'boyfriend', 'girlfriend', 'spouse', 'marriage', 'friend', 'dating', 'husband', 'wife', 'breakup', 'ex', 'fiance', 'crush', 'relationship', 'divorce', 'kissed', 'cheated', 'split', 'argument', 'fight'],
    'family': ['parents', 'mom', 'dad', 'brother', 'sister', 'family', 'mother', 'father', 'uncle', 'aunt', 'relatives', 'siblings', 'grandma', 'grandpa', 'cousin', 'children', 'kids', 'son', 'daughter', 'household'],
    'health': ['sick', 'ill', 'pain', 'body', 'health', 'sleep', 'doctor', 'hospital', 'disease', 'medication', 'injury', 'therapy', 'surgery', 'symptoms', 'medicine', 'fever', 'headache', 'physique', 'diagnosis'],
    'hobbies': ['game', 'music', 'art', 'reading', 'travel', 'sports', 'hobby', 'creative', 'writing', 'painting', 'dancing', 'instrument', 'concert', 'movie'],
    'finances': ['money', 'debt', 'bills', 'bank', 'cost', 'expensive', 'broke', 'savings', 'rent', 'mortgage', 'loan', 'investment', 'budget'],
    'future': ['future', 'plans', 'tomorrow', 'ahead', 'next year', 'someday', 'goal', 'vision', 'dream', 'uncertainty']
}

def analyze_emotion(text, language='en'):
    # Translate to English if target language is Telugu so our NLP works
    if language == 'te':
        try:
            text = GoogleTranslator(source='te', target='en').translate(text)
        except Exception:
            pass

    lower_text = text.lower()
    
    # 1. NLP: TextBlob Sentiment Analysis
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    detected_emotion = 'Neutral'
    intensity = 'Low'
    confidence = 0
    
    # 2. Advanced NLP Heuristic Evaluation
    # Weigh keywords found against the length of the string to boost accuracy
    word_count = len(lower_text.split())
    if word_count == 0: word_count = 1

    emotion_scores = {}
    for emotion, words in EMOTION_KEYWORDS.items():
        matches = sum(1 for w in words if w in lower_text)
        if matches > 0:
            emotion_scores[emotion] = matches

    max_matches = 0
    if emotion_scores:
        detected_emotion = max(emotion_scores, key=emotion_scores.get)
        max_matches = emotion_scores[detected_emotion]

    detected_topic = None
    topic_scores = {}
    for topic, words in TOPIC_KEYWORDS.items():
        matches = sum(1 for w in words if w in lower_text)
        if matches > 0:
            topic_scores[topic] = matches
            
    if topic_scores:
        detected_topic = max(topic_scores, key=topic_scores.get)

    if max_matches == 0:
        if polarity < -0.4:
            detected_emotion = 'Sadness'
            intensity = 'High' if polarity < -0.7 else 'Medium'
            confidence = 65
        elif polarity > 0.4:
            detected_emotion = 'Happiness'
            intensity = 'High' if polarity > 0.7 else 'Medium'
            confidence = 65
        elif polarity < -0.1 and subjectivity > 0.6:
            detected_emotion = 'Frustration' if polarity > -0.3 else 'Anger'
            intensity = 'Medium'
            confidence = 55
        else:
            if len(lower_text) > 60 and subjectivity > 0.6:
                detected_emotion = 'Stress'
                intensity = 'Medium'
                confidence = 50
            else:
                return {
                    'emotion': 'Neutral',
                    'intensity': 'Low',
                    'confidence': 40,
                    'insight': "Your emotional state seems balanced or unstated.",
                    'topic': detected_topic,
                    'recommendedAgentId': 'listener',
                    'nlp_polarity': polarity
                }
    else:
        # Complex accuracy: 
        # Calculate frequency per word baseline, boost confidence based on keyword density and NLP subjectivity overlap
        density_multiplier = (max_matches / word_count) * 10 
        polarity_match_bonus = 15 if (polarity < 0 and detected_emotion not in ['Happiness', 'Joy']) else 0
        
        confidence = min(60 + (max_matches * 12) + polarity_match_bonus + density_multiplier, 98)
        confidence = round(confidence, 1)
        
        if max_matches >= 3 or (max_matches >= 2 and subjectivity > 0.7):
            intensity = 'High'
        elif max_matches == 2 or subjectivity > 0.5:
            intensity = 'Medium'
        else:
            intensity = 'Low'

    topic_text = f" related to your {detected_topic}" if detected_topic else ""
    insight = f"You seem to be experiencing {intensity.lower()} levels of {detected_emotion.lower()}{topic_text}."

    recommended_agent = next((a for a in AGENTS if a['targetEmotion'] == detected_emotion), AGENTS[1])

    return {
        'emotion': detected_emotion,
        'intensity': intensity,
        'confidence': confidence,
        'insight': insight,
        'topic': detected_topic,
        'recommendedAgentId': recommended_agent['id'],
        'nlp_polarity': polarity
    }

def generate_agent_response(agent_id, user_text, user_emotion_data, chat_history, language='en'):
    # This acts as a sophisticated rule-based generation engine.
    # We use TextBlob to extract noun phrases for mirroring to increase 'relatedness'.
    blob = TextBlob(user_text)
    noun_phrases = blob.noun_phrases
    
    emotion = user_emotion_data['emotion']
    intensity = user_emotion_data['intensity']
    topic = user_emotion_data.get('topic')
    
    is_first_interaction = len([m for m in chat_history if m.get('role') == 'user']) <= 1
    is_question = '?' in user_text
    
    # Mirroring logic: find a significant noun phrase to reference
    mirror_phrase = ""
    if noun_phrases:
        # Pick a phrase that's not too short and not too long
        valid_phrases = [p for p in noun_phrases if len(p.split()) >= 1]
        if valid_phrases:
            mirror_phrase = random.choice(valid_phrases)

    # Expanded Specialist Actions
    agent_actions = {
        'calm': [
            "Take a deep breath. Inhale for 4, hold for 4, exhale for 6. Let's find your center.",
            "I can feel the tension in your words. Let's try to release that physical weight together.",
            "You don't have to carry it all right now. Just focus on this one breath."
        ],
        'listener': [
            "I'm listening with full attention. Please, tell me more about what's been on your mind.",
            "That sounds like a lot to handle. I'm here to hold this space for you as long as you need.",
            "Your feelings are completely valid. What part of this feels the heaviest right now?"
        ],
        'coach': [
            "Let's break this down into one small, actionable piece. What's the very first step?",
            "You have more strength than you realize. Let's turn this obstacle into a strategy.",
            "Focus on what you *can* influence today. Everything else can wait until we have a plan."
        ],
        'anchor': [
            "Focus on the physical space around you. Name three things you can see and two you can hear.",
            "You are grounded. You are safe. The storm of thoughts will pass, but you remain here.",
            "Let's bring your awareness back to the present moment. Feel the seat beneath you."
        ],
        'vent': [
            "Let it out. Don't hold back—this is a safe, judgment-free zone for your rawest thoughts.",
            "Say exactly what you've been wanting to shout. I'm here to absorb it all.",
            "It's okay to be frustrated. Tell me every detail that's bothering you."
        ],
        'protector': [
            "You are safe here. I am guarding this digital space for your peace of mind.",
            "No matter what's happening outside, right here, you are protected and heard.",
            "Deep breaths. We are going to navigate this together, one step at a time."
        ],
        'joy': [
            "This is such a wonderful win! Let's take a moment to really soak in this feeling.",
            "You worked for this, and you deserve every bit of this happiness!",
            "I love hearing this! What was the best part of the experience for you?"
        ],
        'companion': [
            "Loss is a heavy journey, and I am honored to walk beside you in it.",
            "There are no words that take the pain away, but there is power in not being alone.",
            "Be gentle with yourself. Healing isn't a straight line, and I'm here for the turns."
        ],
        'clarity': [
            "It sounds like there's a lot of fog right now. Let's look for a single point of light.",
            "When things feel mixed up, writing them out can help. What's the most confusing part?",
            "Let's peel back the layers. What is the core truth you're looking for?"
        ]
    }

    # Topic-Specific Guidance (Expanded)
    topic_responses = {
        'work': "Work should be a part of your life, not the weight of it. Boundaries are essential.",
        'school': "Academic pressure doesn't define your worth. Take it one assignment at a time.",
        'relationships': "Human connections are complex. Vulnerability is a strength, not a weakness.",
        'family': "Family dynamics carry deep history. It's okay to prioritize your own peace.",
        'health': "Your body is talking to you. Listen and be kind to yourself today.",
        'finances': "Financial stress is deeply unsettling, but a budget and a plan can help regain a sense of security.",
        'hobbies': "Immersing yourself in something you love is a powerful form of self-care.",
        'future': "The future is unwritten. While it's natural to feel uncertain, focusing on the next 'now' can help."
    }
    
    # Selection logic
    base_actions = agent_actions.get(agent_id, ["I'm listening closely. Please continue sharing."])
    action = random.choice(base_actions)

    # Building the synthesis
    response_parts = []
    
    # 1. Identity Tag
    response_parts.append(f"[{agent_id.upper()} AGENT]")

    # 2. Mirroring (Make it related to THEIR text)
    if mirror_phrase:
        if is_question:
            response_parts.append(f"Regarding '{mirror_phrase}', that's a significant question.")
        else:
            response_parts.append(f"I'm focusing specifically on what you said about '{mirror_phrase}'.")
    
    # 3. Emotional Validation
    if emotion != 'Neutral':
        if intensity == 'High':
            response_parts.append(f"I can really sense the intensity of this {emotion.lower()} you're describing.")
        else:
            response_parts.append(f"I hear the {emotion.lower()} in your words and I'm here with you.")
    
    # 4. Topic Integration
    if topic and topic in topic_responses:
        response_parts.append(topic_responses[topic])

    # 5. Specialist Action
    response_parts.append(action)

    # 6. Intent-based follow-up
    if is_question:
        response_parts.append("Does that help clarify things, or should we look at it another way?")
    elif not is_first_interaction and random.random() > 0.8:
        response_parts.append("Tell me more about what that's like for you.")

    response_text = " ".join(response_parts).strip()
    
    if language == 'te':
        try:
            response_text = GoogleTranslator(source='en', target='te').translate(response_text)
        except Exception:
            pass
            
    return response_text
