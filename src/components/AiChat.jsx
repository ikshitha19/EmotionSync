import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { analyzeEmotion } from '../utils/api';

// Hardcoded for presentation layer. Fallbacks if no backend hookup.
export const agents = [
    { id: 'calm', name: 'Calm & Relaxation', icon: '🌿', targetEmotion: 'Stress', description: 'Soft tone, breathing exercises.' },
    { id: 'listener', name: 'Supportive Listener', icon: '💬', targetEmotion: 'Sadness', description: 'Empathetic validation.' },
    { id: 'coach', name: 'Motivational Coach', icon: '💪', targetEmotion: 'Low Confidence', description: 'Goal-focused, energetic.' },
    { id: 'positive', name: 'Positivity Booster', icon: '😊', targetEmotion: 'Low Mood', description: 'Light tone, optimistic.' },
    { id: 'anchor', name: 'Anxiety Anchor', icon: '⚓', targetEmotion: 'Anxiety', description: 'Grounding logic, deep breaths.' },
    { id: 'vent', name: 'Vent Receiver', icon: '🌋', targetEmotion: 'Anger', description: 'Safe space to let it all out.' },
    { id: 'companion', name: 'Grief Companion', icon: '🕊️', targetEmotion: 'Grief', description: 'Gentle presence for deep loss.' },
    { id: 'joy', name: 'Joy Amplifier', icon: '🎉', targetEmotion: 'Happiness', description: 'Matches your excitement and wins!' },
];

export default function AiChat({ onBack, onSaveAnalytics }) {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Connection secured. EmotionSync analysis engine active.' },
        { role: 'ai', content: 'Hello. I am EmotionSync, your intelligence. How are you feeling right now?' }
    ]);
    const [input, setInput] = useState('');
    const [insight, setInsight] = useState(null);
    const [activeAgent, setActiveAgent] = useState('listener'); // default
    const [language, setLanguage] = useState('en');

    // Voice & Crisis features
    const [isRecording, setIsRecording] = useState(false);
    const [isCrisis, setIsCrisis] = useState(false);

    const endOfMessagesRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            let finalTranscript = '';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setInput(finalTranscript + interimTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error !== 'no-speech') {
                    setIsRecording(false);
                    recognitionRef.current.isActive = false;
                }
            };

            recognitionRef.current.onend = () => {
                // If it disconnects naturally due to pause but user didn't click stop, keep listening
                if (recognitionRef.current.isActive) {
                    try { recognitionRef.current.start(); } catch (e) { }
                } else {
                    setIsRecording(false);
                }
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.isActive = false;
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.lang = language === 'te' ? 'te-IN' : 'en-US';
            recognitionRef.current.isActive = true;
            setInput(''); // Clear input for new continuous speech block
            try { recognitionRef.current?.start(); } catch (e) { }
            setIsRecording(true);
        }
    };

    // Ambient Visuals Effect
    useEffect(() => {
        const bd = document.body;
        // Clean up previous themes
        bd.classList.remove('theme-stress', 'theme-sadness', 'theme-anger', 'theme-happiness', 'theme-anxiety');

        if (insight && insight.emotion) {
            const e = insight.emotion.toLowerCase();
            if (e === 'stress') bd.classList.add('theme-stress');
            else if (e === 'sadness') bd.classList.add('theme-sadness');
            else if (e === 'anger') bd.classList.add('theme-anger');
            else if (e === 'happiness') bd.classList.add('theme-happiness');
            else if (e === 'anxiety') bd.classList.add('theme-anxiety');
        }

        return () => {
            bd.classList.remove('theme-stress', 'theme-sadness', 'theme-anger', 'theme-happiness', 'theme-anxiety');
        };
    }, [insight]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const checkCrisis = (text) => {
        const dangerWords = ['suicide', 'kill myself', 'end my life', 'want to die', 'harm myself'];
        const isDanger = dangerWords.some(w => text.toLowerCase().includes(w));
        if (isDanger) setIsCrisis(true);
        return isDanger;
    };

    const handleSend = async () => {
        if (!input.trim() || isCrisis) return;

        // Front-end Crisis Check Interception
        if (checkCrisis(input)) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            const currentAgent = insight?.recommendedAgentId || activeAgent;

            const data = await analyzeEmotion({
                text: userMsg.content,
                chatHistory: messages,
                activeAgent: currentAgent,
                language: language
            });

            if (data.stats.emotion !== 'Neutral' || insight === null) {
                setInsight({ ...data.stats, nlp_polarity: data.stats.nlp_polarity });
                if (data.stats.recommendedAgentId) {
                    setActiveAgent(data.stats.recommendedAgentId);
                }

                // Track for Dashboard mode (Mode 3)
                onSaveAnalytics && onSaveAnalytics({
                    date: new Date().toISOString(),
                    emotion: data.stats.emotion,
                    intensity: data.stats.intensity,
                    topic: data.stats.topic || 'General'
                });
            }

            setMessages(prev => [...prev, { role: 'ai', content: data.response }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: 'Connection to backend language model lost. Try again.' }]);
        }
    };

    // Crisis Component View
    if (isCrisis) {
        return (
            <div className="crisis-overlay">
                <h2>Emergency Safety Intervention</h2>
                <p>
                    Our emotion engine has detected keywords indicating severe distress or risk of harm.
                    Please know that you are not alone, and there is immediate help available for you right now.
                    This AI is not equipped to handle medical emergencies.
                </p>
                <div className="helpline-box">
                    <h3>Call 988</h3>
                    <p style={{ marginBottom: 0 }}>Suicide & Crisis Lifeline (Available 24/7)</p>
                </div>
                <button className="btn-danger-outline" onClick={() => setIsCrisis(false)}>
                    I am safe. Return to Chat.
                </button>
            </div>
        );
    }

    return (
        <div className="chat-layout">
            {/* Sidebar: Emotion Insight & Agent Selection */}
            <aside className="glass-panel sidebar">
                <div className="sidebar-header">
                    <button className="btn-back" onClick={onBack}>
                        ← Back to Dashboard
                    </button>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="sidebar-title" style={{ marginTop: 0 }}>Session State</h2>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            style={{ background: 'rgba(15, 23, 42, 0.5)', color: 'white', padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        >
                            <option value="en">Eng (US)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                        </select>
                    </div>
                </div>

                {insight ? (
                    <div className="insight-panel">
                        <h3>NLP Analysis</h3>
                        <div className="insight-val">{insight.emotion} - {insight.intensity}</div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Confidence: {insight.confidence}%
                        </p>
                        <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            &quot;{insight.insight}&quot;
                        </p>
                    </div>
                ) : (
                    <div className="insight-panel">
                        <h3>Emotion Detected</h3>
                        <div className="insight-val" style={{ color: 'var(--text-muted)' }}>Awaiting input...</div>
                    </div>
                )}

                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', marginTop: '1rem', fontFamily: 'var(--font-heading)' }}>Available Personas</h3>
                <div className="agent-list">
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            className={`agent-item ${activeAgent === agent.id ? 'active' : ''} ${insight?.recommendedAgentId === agent.id ? 'recommended' : ''}`}
                            onClick={() => setActiveAgent(agent.id)}
                        >
                            <div className="agent-icon">{agent.icon}</div>
                            <div className="agent-info">
                                <div className="agent-name">
                                    {agent.name}
                                    {insight?.recommendedAgentId === agent.id && <span className="badge-rec">REC</span>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                    {agent.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="glass-panel chat-main">
                <header className="chat-header">
                    <div className="header-left">
                        <div className="agent-icon" style={{ fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.4rem' }}>
                            {agents.find(a => a.id === activeAgent)?.icon || '🤖'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{agents.find(a => a.id === activeAgent)?.name || 'AI Assistant'}</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--accent-green)', margin: 0, marginTop: '2px' }}>● Real-time Secure Cloud</p>
                        </div>
                    </div>
                </header>

                <section className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </section>

                <footer className="chat-input-area">
                    <button
                        className={`icon-btn ${isRecording ? 'recording' : ''}`}
                        onClick={toggleRecording}
                        title={isRecording ? 'Stop Recording' : 'Start Voice Engine'}
                    >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <div className={`voice-visualizer ${isRecording ? 'active' : ''}`}>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                        <div className="voice-bar"></div>
                    </div>

                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isRecording ? "Listening..." : "Type how you are feeling naturally..."}
                    />

                    <button className="btn-send" onClick={handleSend}>
                        <Send size={20} />
                    </button>
                </footer>
            </main>
        </div>
    );
}
