import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsDashboard({ onBack, rawData }) {

    // Derived metrics from raw data saved during sessions
    const stats = useMemo(() => {
        if (!rawData || rawData.length === 0) return { total: 0, emotions: [], topics: [] };

        const eCount = {};
        const tCount = {};

        rawData.forEach(log => {
            eCount[log.emotion] = (eCount[log.emotion] || 0) + 1;
            tCount[log.topic] = (tCount[log.topic] || 0) + 1;
        });

        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        const emotions = Object.keys(eCount).map((k, i) => ({
            name: k, value: eCount[k], color: COLORS[i % COLORS.length]
        }));

        const topics = Object.keys(tCount).map(k => ({
            name: k, count: tCount[k]
        }));

        return { total: rawData.length, emotions, topics };
    }, [rawData]);

    return (
        <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={onBack}>← Back</button>
                    <h2 className="user-greeting">Mood & Analytics Hub</h2>
                </div>
            </div>

            {stats.total === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Data Available Yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Start an AI Session and share your thoughts to generate deep structural NLP reports.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Emotion Heatmap Pipeline */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Emotional Composition</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Deep analytical breakdown of your baseline states across {stats.total} interactions.
                        </p>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.emotions} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5}>
                                        {stats.emotions.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Topic Detection Timeline */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Topic Triggers</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            The contextual subjects correlated directly to your strongest emotions.
                        </p>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topics} layout="vertical" margin={{ left: 30, right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#f8fafc', fontSize: 13 }} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '10px' }} />
                                    <Bar dataKey="count" fill="var(--accent-secondary)" radius={[0, 10, 10, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
