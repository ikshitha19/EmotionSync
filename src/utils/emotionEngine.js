// Simple Rule-Based Emotion Detection Engine
// This mocks the backend NLP service for the presentation layer.

export const agents = [
    { id: 'calm', name: 'Calm & Relaxation', icon: '🌿', targetEmotion: 'Stress', description: 'Soft tone, breathing exercises.' },
    { id: 'listener', name: 'Supportive Listener', icon: '💬', targetEmotion: 'Sadness', description: 'Empathetic validation.' },
    { id: 'coach', name: 'Motivational Coach', icon: '💪', targetEmotion: 'Low Confidence', description: 'Goal-focused, energetic.' },
    { id: 'positive', name: 'Positivity Booster', icon: '😊', targetEmotion: 'Low Mood', description: 'Light tone, optimistic.' },
    { id: 'anchor', name: 'Anxiety Anchor', icon: '⚓', targetEmotion: 'Anxiety', description: 'Grounding logic, deep breaths.' },
    { id: 'vent', name: 'Vent Receiver', icon: '🌋', targetEmotion: 'Anger', description: 'Safe space to let it all out.' },
    { id: 'companion', name: 'Grief Companion', icon: '🕊️', targetEmotion: 'Grief', description: 'Gentle presence for deep loss.' },
    { id: 'joy', name: 'Joy Amplifier', icon: '🎉', targetEmotion: 'Happiness', description: 'Matches your excitement and wins!' },
    { id: 'strategist', name: 'Productivity Strategist', icon: '📈', targetEmotion: 'Burnout', description: 'Breaks down overwhelm.' },
    { id: 'clarity', name: 'Clarity Guide', icon: '🧭', targetEmotion: 'Confusion', description: 'Untangles complex thoughts.' },
    { id: 'connector', name: 'Connection Builder', icon: '🤝', targetEmotion: 'Loneliness', description: 'Warmth and human connection.' },
    { id: 'care', name: 'Self-Care Advocate', icon: '☕', targetEmotion: 'Exhaustion', description: 'Focuses on basic physical needs.' },
    { id: 'protector', name: 'Safe Space Protector', icon: '🛡️', targetEmotion: 'Fear', description: 'Creates a feeling of security.' },
    { id: 'mindful', name: 'Mindfulness Mentor', icon: '🧘', targetEmotion: 'Apathy', description: 'Gentle observation without judgment.' }
];

const emotionKeywords = {
    Stress: ['overwhelmed', 'too much', 'stress', 'cant cope', 'busy', 'pressure', 'tense', 'pushed'],
    Sadness: ['sad', 'depressed', 'crying', 'heartbroken', 'sorrow', 'hurt', 'upset', 'down'],
    'Low Confidence': ['fail', 'useless', 'stupid', 'imposter', "can't do", 'give up', 'insecure', 'doubt', 'worthless', 'bad at', 'mistake'],
    'Low Mood': ['meh', 'whatever', 'unmotivated', 'sluggish', 'lazy', 'bleh'],
    Anxiety: ['anxious', 'panic', 'nervous', 'worried', 'dread', 'overthinking', 'racing', 'doom'],
    Anger: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'pissed', 'frustrated', 'irritated'],
    Grief: ['grief', 'loss', 'died', 'passed away', 'mourning', 'bereavement', 'widow', 'miss them'],
    Happiness: ['happy', 'great', 'awesome', 'excited', 'joy', 'wonderful', 'amazing', 'best', 'thrilled'],
    Burnout: ['burned out', 'quit', 'can\'t take it', 'drained', 'fried', 'spent', 'done'],
    Confusion: ['confused', 'lost', 'don\'t know', 'unsure', 'stuck', 'torn', 'decide', 'options'],
    Loneliness: ['lonely', 'isolated', 'no one', 'alone', 'abandoned', 'left out', 'ignored'],
    Exhaustion: ['exhausted', 'tired', 'sleepy', 'fatigue', 'no energy', 'wiped out'],
    Fear: ['scared', 'afraid', 'terrified', 'fear', 'threat', 'danger', 'frightened'],
    Apathy: ['bored', 'numb', 'empty', 'nothing', 'dont care']
};

const topicKeywords = {
    work: ['work', 'boss', 'job', 'office', 'manager', 'colleagues', 'deadline', 'client', 'career', 'project', 'meeting'],
    school: ['school', 'exam', 'study', 'grades', 'professor', 'college', 'homework', 'assignment', 'class', 'test'],
    relationships: ['partner', 'boyfriend', 'girlfriend', 'spouse', 'marriage', 'friend', 'dating', 'husband', 'wife', 'breakup', 'ex'],
    family: ['parents', 'mom', 'dad', 'brother', 'sister', 'family', 'mother', 'father'],
    health: ['sick', 'ill', 'pain', 'body', 'health', 'sleep', 'doctor', 'hospital']
};

export const analyzeEmotion = (text) => {
    const lowerText = text.toLowerCase();

    let detectedEmotion = 'Neutral';
    let intensity = 'Low';
    let confidence = 0;

    // Emotion parsing
    let maxMatches = 0;
    for (const [emotion, words] of Object.entries(emotionKeywords)) {
        let matches = 0;
        for (const w of words) {
            if (lowerText.includes(w)) matches++;
        }
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedEmotion = emotion;
        }
    }

    // Topic parsing
    let detectedTopic = null;
    let maxTopicMatches = 0;
    for (const [topic, words] of Object.entries(topicKeywords)) {
        let matches = 0;
        for (const w of words) {
            if (lowerText.includes(w)) matches++;
        }
        if (matches > maxTopicMatches) {
            maxTopicMatches = matches;
            detectedTopic = topic;
        }
    }

    if (maxMatches === 0) {
        if (lowerText.length > 50) {
            detectedEmotion = 'Stress';
            intensity = 'Medium';
            confidence = 65;
        } else {
            return {
                emotion: 'Neutral',
                intensity: 'Low',
                confidence: 40,
                insight: "Your emotional state seems balanced or unstated.",
                topic: detectedTopic,
                recommendedAgentId: 'listener'
            };
        }
    } else {
        confidence = Math.min(60 + (maxMatches * 10), 98);
        intensity = maxMatches > 2 ? 'High' : (maxMatches === 2 ? 'Medium' : 'Low');
    }

    // Generate insight
    const topicText = detectedTopic ? ` related to your ${detectedTopic}` : '';
    const insight = `You seem to be experiencing ${intensity.toLowerCase()} levels of ${detectedEmotion.toLowerCase()}${topicText}.`;

    // Recommended Agent
    const recommendedAgent = agents.find(a => a.targetEmotion === detectedEmotion) || agents[1];

    return {
        emotion: detectedEmotion,
        intensity,
        confidence,
        insight,
        topic: detectedTopic,
        recommendedAgentId: recommendedAgent.id
    };
};

export const generateAgentResponse = (agentId, userText, userEmotionData, chatHistory = []) => {
    const { emotion, intensity, topic } = userEmotionData;

    const isFirstInteraction = chatHistory.filter(m => m.role === 'user').length <= 1;

    const acknowledgments = {
        Stress: ["It sounds like you're carrying a heavy load.", "I can hear the pressure you're under.", "That sounds overwhelming."],
        Sadness: ["I'm so sorry you're feeling this way.", "It's completely okay to feel sad about this.", "My heart goes out to you."],
        'Low Confidence': ["It's tough when self-doubt creeps in.", "I hear the hesitation.", "It takes courage to admit feeling unsure."],
        'Low Mood': ["Sitting with a low mood is hard.", "I hear that things feel flat right now.", "It's okay to not be okay today."],
        Anxiety: ["I can sense how much this is worrying you.", "It sounds like your mind is racing.", "Anxiety can feel so consuming."],
        Anger: ["You have every right to feel frustrated!", "I can totally see why that made you so mad.", "That sounds incredibly infuriating."],
        Grief: ["I am so incredibly sorry for your loss.", "There are no words, but I am here with you.", "Grief is a heavy burden to carry."],
        Happiness: ["That is amazing!", "I love hearing this!", "What fantastic news!"],
        Burnout: ["You sound completely drained.", "It sounds like you have given absolutely everything.", "Burnout is real and it hits hard."],
        Confusion: ["It makes total sense that you're feeling torn.", "That sounds like a really complicated situation.", "It's okay to not have the answers yet."],
        Loneliness: ["Feeling alone in this must be so hard.", "Isolation is incredibly difficult to sit with.", "I am right here with you."],
        Exhaustion: ["You sound physically and mentally wiped out.", "It sounds like your battery is at zero.", "That level of exhaustion is tough."],
        Fear: ["I hear how scared you are.", "It's completely valid to feel afraid right now.", "That sounds genuinely terrifying."],
        Apathy: ["It's hard when feeling numb takes over.", "I hear the emptiness.", "Sometimes we just shut down."],
        Neutral: ["I'm listening.", "Thank you for sharing that.", "I see."]
    };

    const topicReflections = {
        work: ["Work environments can place so much pressure on us.", "Balancing career expectations is draining.", "Job stress really bleeds into our personal lives."],
        school: ["Academic pressure can feel like a constantly ticking clock.", "School takes so much mental energy.", "Exams and assignments are genuinely stressful."],
        relationships: ["Navigating relationships is one of the hardest things we do.", "When things are unsteady with someone, it affects everything.", "Interpersonal dynamics are complex."],
        family: ["Family situations often carry deeply rooted feelings.", "Navigating family dynamics is exhausting.", "It's complex when it comes to family."],
        health: ["Health worries amplify everything else.", "Not feeling physically right is deeply upsetting.", "Our bodies hold so much of our stress."]
    };

    const agentActions = {
        calm: ["Let's take a deep breath. Inhale for 4, exhale for 6.", "Try to drop your shoulders and unclench your jaw.", "Can you name 3 things you can see around you?"],
        listener: ["I am here for you completely. Do you want to vent more?", "You don't have to fix this right now. Just feel it.", "I'm not here to judge. Tell me more."],
        coach: ["Let's break this big problem down into one small, actionable piece.", "What is one tiny win you can secure today?", "You are capable of handling this. What's step one?"],
        positive: ["Can we find one small silver lining?", "Let's try a gratitude pivot! What went right today?", "Sending you warm energy. You'll get through this!"],
        anchor: ["Let's focus purely on facts right now. What is true in this exact moment?", "Your anxiety is lying to you. Let's ground ourselves in reality.", "Focus on the physical space around you. Feel your feet on the floor."],
        vent: ["Let it all out. Seriously, don't hold back.", "That is completely unfair. Tell me everything that frustrated you about it.", "I'm on your side. That sounds ridiculous. What happened next?"],
        companion: ["There is no rush to 'get over' this. Take all the time you need.", "I'll sit in the dark with you as long as you need.", "Your grief is a testament to how much it mattered. Be gentle with yourself."],
        joy: ["Let's celebrate this!! You deserve this win!", "I'm literally cheering for you right now! Tell me more about how it went!", "That's huge! How are you going to celebrate?"],
        strategist: ["Stop looking at the whole mountain. What is the very next rock we step on?", "Let's aggressively prioritize. What can we cross off or ignore today?", "We need to clear your plate. What is strictly non-essential right now?"],
        clarity: ["If your best friend was in this situation, what advice would you give them?", "Let's untangle this. What is the biggest unknown here?", "Let's write out your options A and B right now."],
        connector: ["It's a very human thing to feel the way you do.", "We all need connection. Reaching out here was a great first step.", "You aren't the only one who struggles with this, even if it feels that way."],
        care: ["When was the last time you drank a glass of water or ate?", "I need you to prioritize sleep tonight. Nothing else is as important.", "Please go rest. The world will keep spinning if you take a break."],
        protector: ["You are safe right here in this digital space.", "Whatever is threatening your peace, it can't reach you in this chat.", "Take a deep breath. You are secure."],
        mindful: ["Notice that feeling of emptiness, but don't judge it.", "Imagine your thoughts like clouds passing by. Just observe.", "It's okay to feel nothing. Just be present right now without expectations."]
    };

    let response = "";

    if (!isFirstInteraction && Math.random() > 0.5) {
        response += "Following up on what you said... ";
    }

    const ackPool = acknowledgments[emotion] || acknowledgments['Neutral'];
    response += ackPool[Math.floor(Math.random() * ackPool.length)] + " ";

    if (topic && topicReflections[topic]) {
        const topPool = topicReflections[topic];
        response += topPool[Math.floor(Math.random() * topPool.length)] + " ";
    }

    let agentPool = agentActions[agentId] || agentActions['listener'];
    const action = agentPool[Math.floor(Math.random() * agentPool.length)];

    if (intensity === 'High' && (agentId === 'calm' || agentId === 'anchor')) {
        response += "Because the intensity seems so high right now, we need to pause immediately. " + action;
    } else {
        response += action;
    }

    if (!response.trim()) {
        response = "I hear you. Tell me more.";
    }

    return response.trim();
};
