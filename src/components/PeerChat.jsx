import React, { useState, useEffect } from 'react';

export default function PeerChat({ onBack, peersOnline }) {
    const [matching, setMatching] = useState(true);
    const [matchFailed, setMatchFailed] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Connection secured. Peer matching in progress...' }
    ]);
    const [input, setInput] = useState('');
    const [isToxicBlock, setIsToxicBlock] = useState(false);

    useEffect(() => {
        // Initial setup timeout
        const timer = setTimeout(() => {
            setMatching(false);

            // Since the user can only enter this mode when peers are online, guarantee a match
            // BUT ensure a fallback if someone literally disconnected exactly as they clicked
            const isPeerFound = peersOnline >= 2;

            if (isPeerFound) {
                setMessages(prev => [
                    ...prev,
                    { role: 'system', content: 'Matched! You are securely connected with an anonymous peer.' },
                    { role: 'system', content: '🔒 Toxicity AI Filter is Active. Hostile messages will drop connection automatically.' }
                ]);
            } else {
                setMatchFailed(true);
                setMessages(prev => [
                    ...prev,
                    { role: 'system', content: '⚠️ Chat unavailable. The only available peer dropped just before connection. Try again later.' }
                ]);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Watch for dynamic dropouts while chatting
    useEffect(() => {
        if (!matching && !matchFailed && peersOnline < 2) {
            setMatchFailed(true);
            setMessages(prev => [
                ...prev,
                { role: 'system', content: '⚠️ The other user has disconnected. Chat session closed.' }
            ]);
        }
    }, [peersOnline, matching, matchFailed]);

    const handleSend = () => {
        if (!input.trim() || isToxicBlock || matchFailed) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');

        // Simulate peer response after a delay
        setTimeout(() => {
            if (isToxicBlock || matchFailed || peersOnline < 2) return;

            // We simulate a toxicity filter breach for showcase if user input is aggressive
            const filterBreachWords = ['stupid', 'idiot', 'shut up', 'hate'];

            if (filterBreachWords.some(w => input.toLowerCase().includes(w))) {
                setIsToxicBlock(true);
                setMessages(prev => [...prev, { role: 'system', content: '⚠️ CONNECTION TERMINATED: Our NLP model detected hostile language. The session was closed to preserve emotional safety.' }]);
                return;
            }

            const mockReplies = [
                "I genuinely understand exactly how you're feeling.",
                "That's so tough. I went through the exact same thing last year.",
                "Honestly, it feels overwhelming, but you're not alone in thinking that.",
                "I'm listening. Tell me more, venting helps.",
                "Have you tried talking to anyone else about this?"
            ];
            const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
            setMessages(prev => [...prev, { role: 'ai', content: reply }]); // using 'ai' class for styling the peer
        }, 2000 + Math.random() * 2000);
    };

    return (
        <div className="chat-layout" style={{ position: 'relative' }}>
            {matching && (
                <div className="match-overlay" style={{ background: 'rgba(15,23,42,0.95)' }}>
                    <div className="spinner"></div>
                    <h2>Finding a Secure Match</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Analyzing emotional topic rooms...</p>
                </div>
            )}

            {/* Main Chat Area */}
            <main className="glass-panel chat-main" style={{ margin: '0 auto', maxWidth: '800px', width: '100%', borderColor: isToxicBlock || matchFailed ? 'var(--accent-red)' : 'var(--border-light)' }}>
                <header className="chat-header">
                    <div className="btn-back" onClick={onBack} style={{ cursor: 'pointer', marginRight: '1rem', color: 'var(--text-muted)' }}>
                        ← Abort Session
                    </div>
                    <div className="agent-icon" style={{ fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.4rem' }}>
                        👥
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{matchFailed ? 'No Online Match' : 'Anonymous User #A7X9'}</h2>
                        <p style={{ fontSize: '0.8rem', color: isToxicBlock || matchFailed ? 'var(--accent-red)' : 'var(--accent-green)', margin: 0, marginTop: '2px' }}>
                            {matchFailed ? '● Offline' : (isToxicBlock ? '● Connection Dropped' : '● Live Encrypted Room')}
                        </p>
                    </div>
                </header>

                <section className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.role === 'ai' ? 'ai' : msg.role}`} style={msg.role === 'system' && (msg.content.includes('TERMINATED') || msg.content.includes('not available') || msg.content.includes('unavailable') || msg.content.includes('disconnected')) ? { color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)' } : {}}>
                            {msg.content}
                        </div>
                    ))}
                </section>

                <footer className="chat-input-area">
                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isToxicBlock ? "Restricted." : (matchFailed ? "Chat unavailable." : "Type your message securely...")}
                        disabled={matching || isToxicBlock || matchFailed}
                    />
                    <button className="btn-send" onClick={handleSend} disabled={matching || isToxicBlock || matchFailed} style={isToxicBlock || matchFailed ? { background: 'var(--text-muted)' } : {}}>
                        ↑
                    </button>
                </footer>
            </main>
        </div>
    );
}
