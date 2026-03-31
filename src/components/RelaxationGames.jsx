import React, { useState, useEffect, useRef } from 'react';
import { Target, Activity, Zap, MousePointer2, Grid, Star } from 'lucide-react';

export default function RelaxationGames({ onBack }) {
    const [activeGame, setActiveGame] = useState('breathe');

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={onBack}>← Back</button>
                    <div>
                        <h2 className="user-greeting">Zen Sandbox</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Mini-Games to ground and relax</p>
                    </div>
                </div>
            </header>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button className={`btn-secondary ${activeGame === 'breathe' ? 'active' : ''}`} onClick={() => setActiveGame('breathe')}>
                    <Activity size={18} /> Deep Breathing
                </button>
                <button className={`btn-secondary ${activeGame === 'popit' ? 'active' : ''}`} onClick={() => setActiveGame('popit')}>
                    <MousePointer2 size={18} /> Infinite Pop-It
                </button>
                <button className={`btn-secondary ${activeGame === 'memory' ? 'active' : ''}`} onClick={() => setActiveGame('memory')}>
                    <Grid size={18} /> Mind Match
                </button>
                <button className={`btn-secondary ${activeGame === 'starry' ? 'active' : ''}`} onClick={() => setActiveGame('starry')}>
                    <Star size={18} /> Starry Night
                </button>
                <button className={`btn-secondary ${activeGame === 'focus' ? 'active' : ''}`} onClick={() => setActiveGame('focus')}>
                    <Target size={18} /> Focus Dot
                </button>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', padding: '3rem', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {activeGame === 'breathe' && <BreathingExercise />}
                {activeGame === 'popit' && <PopItGame />}
                {activeGame === 'memory' && <MemoryMatchGame />}
                {activeGame === 'starry' && <StarryNightGame />}
                {activeGame === 'focus' && <FocusDotGame />}
            </div>
        </div>
    );
}

function BreathingExercise() {
    const [phase, setPhase] = useState('Inhale');
    const [timer, setTimer] = useState(4); // 4-7-8 method

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    if (phase === 'Inhale') {
                        setPhase('Hold');
                        return 7;
                    } else if (phase === 'Hold') {
                        setPhase('Exhale');
                        return 8;
                    } else {
                        setPhase('Inhale');
                        return 4;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase]);

    let displaySize = 1;
    let transitionTime = '1s';
    
    if (phase === 'Inhale') {
        displaySize = 1.6;
        transitionTime = '4s';
    } else if (phase === 'Hold') {
        displaySize = 1.6;
        transitionTime = '1s';
    } else {
        displaySize = 1;
        transitionTime = '8s';
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>4-7-8 Relaxation</h3>
            <div style={{ 
                width: '150px', height: '150px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--accent-main), var(--accent-green))',
                opacity: 0.8,
                transform: `scale(${displaySize})`,
                transition: `transform ${transitionTime} ease-in-out`,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)'
            }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {timer}
                </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>{phase}</h2>
        </div>
    );
}

function PopItGame() {
    const rows = 5;
    const cols = 6;
    const initialGrid = Array(rows * cols).fill(false);
    const [grid, setGrid] = useState(initialGrid);

    const togglePop = (index) => {
        const newGrid = [...grid];
        newGrid[index] = !newGrid[index];
        setGrid(newGrid);
    };

    const resetAll = () => {
        setGrid(initialGrid);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 50px)`, gap: '15px' }}>
                {grid.map((isPopped, index) => (
                    <div 
                        key={index}
                        onClick={() => togglePop(index)}
                        style={{
                            width: '50px', height: '50px',
                            borderRadius: '50%',
                            background: isPopped ? 'rgba(255,255,255,0.05)' : 'linear-gradient(145deg, var(--accent-green), var(--accent-main))',
                            boxShadow: isPopped ? 'none' : 'inset 2px 2px 5px rgba(255,255,255,0.3), inset -3px -3px 5px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            transition: 'all 0.1s ease-in-out',
                            transform: isPopped ? 'scale(0.95)' : 'scale(1)'
                        }}
                    >
                    </div>
                ))}
            </div>
            <button className="btn-secondary" onClick={resetAll}><Zap size={18} /> Reset Bubbles</button>
        </div>
    );
}

function MemoryMatchGame() {
    const emojis = ['🌿', '🌊', '☀️', '🏔️', '🌙', '🕊️', '🌸', '✨'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);

    useEffect(() => {
        setupGame();
    }, []);

    const setupGame = () => {
        const shuffled = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, idx) => ({ id: idx, emoji }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
    };

    const handleCardClick = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const match = cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji;
            setTimeout(() => {
                if (match) {
                    setSolved([...solved, newFlipped[0], newFlipped[1]]);
                }
                setFlipped([]);
            }, 1000);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 70px)', gap: '15px' }}>
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || solved.includes(index);
                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            style={{
                                width: '70px', height: '70px',
                                background: isFlipped ? 'var(--dark-lighter)' : 'linear-gradient(135deg, var(--accent-main), var(--accent-green))',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem',
                                borderRadius: '12px', cursor: 'pointer',
                                transition: 'transform 0.3s',
                                transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'
                            }}
                        >
                            {isFlipped ? card.emoji : ''}
                        </div>
                    );
                })}
            </div>
            {solved.length === cards.length && cards.length > 0 && <p style={{ color: 'var(--accent-green)' }}>You found all pairs. Take a deep breath.</p>}
            <button className="btn-secondary" onClick={setupGame}><Zap size={18} /> Reset Board</button>
        </div>
    );
}


function StarryNightGame() {
    const [stars, setStars] = useState([]);

    const addStar = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newStar = { id: Date.now(), x, y, size: Math.random() * 3 + 2, duration: Math.random() * 2 + 1 };
        setStars((prev) => [...prev, newStar]);
        setTimeout(() => {
            setStars((prev) => prev.filter((s) => s.id !== newStar.id));
        }, newStar.duration * 1000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Swipe or click to paint stars into the cosmic void.</p>
            <div 
                onPointerDown={addStar}
                onPointerMove={(e) => { if(e.buttons === 1) addStar(e) }}
                style={{ position: 'relative', width: '400px', height: '300px', background: '#000', borderRadius: '12px', overflow: 'hidden', cursor: 'crosshair', boxShadow: 'inset 0 0 50px rgba(255,255,255,0.1)' }}
            >
                {stars.map((star) => (
                    <div
                        key={star.id}
                        style={{
                            position: 'absolute',
                            left: star.x,
                            top: star.y,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            borderRadius: '50%',
                            background: '#FFF',
                            transform: 'translate(-50%, -50%)',
                            animation: `fadeStar ${star.duration}s ease-in-out forwards`,
                            boxShadow: `0 0 ${star.size * 2}px #FFF`
                        }}
                    />
                ))}
                <style>{`
                    @keyframes fadeStar {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
                    }
                `}</style>
            </div>
        </div>
    );
}

function FocusDotGame() {
    const [pos, setPos] = useState({ x: 200, y: 150 });
    const [clicks, setClicks] = useState(0);

    const moveDot = () => {
        setPos({ x: Math.random() * 340 + 30, y: Math.random() * 240 + 30 });
    };

    useEffect(() => {
        const interval = setInterval(moveDot, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleCatch = () => {
        setClicks(c => c + 1);
        moveDot();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Gently click the moving focus dot to ground yourself. (Score: {clicks})</p>
            <div style={{ position: 'relative', width: '400px', height: '300px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div 
                    onClick={handleCatch}
                    style={{
                        position: 'absolute',
                        left: pos.x, top: pos.y,
                        width: '30px', height: '30px',
                        background: 'var(--accent-green)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 1.5s ease-in-out',
                        cursor: 'pointer',
                        boxShadow: '0 0 15px var(--accent-green)'
                    }}
                />
            </div>
        </div>
    );
}

