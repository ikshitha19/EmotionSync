import time

class EmotionClassifier:
    """
    Modular classifier for identifying emotional states and associated topics.
    Extensible for future ML integrations.
    """
    
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

    def classify(self, text, nlp_stats):
        """
        Main classification loop for emotion and topic.
        Uses rule-based heuristics weight against NLP sentiment.
        """
        lower_text = text.lower()
        word_count = max(len(lower_text.split()), 1)
        polarity = nlp_stats.get('polarity', 0)
        subjectivity = nlp_stats.get('subjectivity', 0)

        emotion_scores = {e: sum(1 for w in ws if w in lower_text) for e, ws in self.EMOTION_KEYWORDS.items()}
        max_matches = max(emotion_scores.values()) if emotion_scores else 0
        detected_emotion = max(emotion_scores, key=emotion_scores.get) if max_matches > 0 else 'Neutral'

        topic_scores = {t: sum(1 for w in ws if w in lower_text) for t, ws in self.TOPIC_KEYWORDS.items()}
        detected_topic = max(topic_scores, key=topic_scores.get) if any(topic_scores.values()) else None

        intensity = 'Low'
        confidence = 40
        
        # Rule-based decision tree for sentiment alignment
        if max_matches == 0:
            if polarity < -0.4:
                detected_emotion, intensity, confidence = 'Sadness', 'High' if polarity < -0.7 else 'Medium', 65
            elif polarity > 0.4:
                detected_emotion, intensity, confidence = 'Happiness', 'High' if polarity > 0.7 else 'Medium', 65
            elif polarity < -0.1 and subjectivity > 0.6:
                detected_emotion, intensity, confidence = 'Anger', 'Medium', 55
        else:
            density = (max_matches / word_count) * 10
            confidence = min(60 + (max_matches * 12) + density, 98)
            intensity = 'High' if max_matches >= 3 else ('Medium' if max_matches >= 2 else 'Low')

        recommended_agent = next((a['id'] for a in self.AGENTS if a['targetEmotion'] == detected_emotion), 'listener')

        return {
            'emotion': detected_emotion,
            'intensity': intensity,
            'confidence': round(confidence, 1),
            'topic': detected_topic,
            'recommended_agent': recommended_agent
        }
