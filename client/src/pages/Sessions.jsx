import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Sessions.css';

const modeIcons = {
    sync: '👥',
    scholar: '🎓',
    probe: '💬',
    reflect: '🧠',
    care: '❤️',
    verdict: '⚖️',
    spark: '💡'
};

function Sessions() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [modes, setModes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMode, setSelectedMode] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Deletion states
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

    // Multi-select states
    const [selectedSessions, setSelectedSessions] = useState(new Set());
    const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);
    const [isDeletingSelected, setIsDeletingSelected] = useState(false);

    // Transcription states
    const [transcribingId, setTranscribingId] = useState(null);
    const [generatingPdfId, setGeneratingPdfId] = useState(null);

    // Create form state
    const [newSession, setNewSession] = useState({
        title: '',
        modeId: '',
        duration: 0,
        notes: ''
    });

    const loadData = async () => {
        console.log("📡 loadData starting...");
        try {
            const modesData = await api.getModes();
            console.log("📡 loadData modes received:", modesData);
            if (Array.isArray(modesData)) {
                setModes(modesData);
            } else {
                console.warn("⚠️ loadData: modesData is not an array:", modesData);
                throw new Error("Invalid modes data");
            }
        } catch (err) {
            console.error("❌ loadData error:", err);
            // Use fallback modes
            setModes([
                { id: '1', name: 'LUNO Sync', slug: 'sync', color: '#6366f1' },
                { id: '2', name: 'LUNO Scholar', slug: 'scholar', color: '#8b5cf6' },
                { id: '3', name: 'LUNO Probe', slug: 'probe', color: '#ec4899' },
                { id: '4', name: 'LUNO Reflect', slug: 'reflect', color: '#14b8a6' },
                { id: '5', name: 'LUNO Care', slug: 'care', color: '#f43f5e' },
                { id: '6', name: 'LUNO Verdict', slug: 'verdict', color: '#f59e0b' },
                { id: '7', name: 'LUNO Spark', slug: 'spark', color: '#22c55e' }
            ]);
        }
    };

    const loadSessions = async () => {
        console.log("📡 loadSessions starting...");
        setLoading(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (selectedMode) params.mode = selectedMode;

            const data = await api.getSessions(params);
            console.log("📡 loadSessions data received:", data);
            setSessions(Array.isArray(data.sessions) ? data.sessions : []);
        } catch (err) {
            console.error("❌ loadSessions error:", err);
            setError(err.message);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("📂 Sessions Page State:", {
            hasUser: !!user,
            userEmail: user?.email,
            sessionsCount: sessions.length,
            loading,
            error
        });
    }, [user, sessions, loading, error]);

    useEffect(() => {
        loadData();
    }, [user]);

    useEffect(() => {
        loadSessions();
    }, [searchQuery, selectedMode, user]);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        console.log("📤 handleCreateSession starting with:", newSession);
        try {
            const created = await api.createSession(newSession);
            console.log("✅ handleCreateSession success:", created);
            setSessions([created, ...sessions]);
            setShowCreateModal(false);
            setNewSession({ title: '', modeId: '', duration: 0, notes: '' });
        } catch (err) {
            console.error("❌ handleCreateSession error:", err);
            setError(err.message);
        }
    };

    const handleDeleteSession = async (id) => {
        // If not already confirming, show confirmation button
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            // Auto-cancel confirmation after 5 seconds
            setTimeout(() => {
                setConfirmDeleteId(current => current === id ? null : current);
            }, 5000);
            return;
        }

        console.log("🗑️ handleDeleteSession starting for:", id);
        setDeletingId(id);
        setError(null);

        try {
            await api.deleteSession(id);
            console.log("✅ handleDeleteSession success");
            setSessions(sessions.filter(s => s.id !== id));
            setSelectedSession(null);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("❌ handleDeleteSession error:", err);
            setError(`Failed to delete session: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAllSessions = async () => {
        if (sessions.length === 0) return;

        if (!showDeleteAllConfirm) {
            setShowDeleteAllConfirm(true);
            return;
        }

        console.log("🗑️ handleDeleteAllSessions starting...");
        setIsDeletingAll(true);
        setError(null);

        try {
            await api.deleteAllSessions();
            console.log("✅ handleDeleteAllSessions success");
            setSessions([]);
            setSelectedSession(null);
            setShowDeleteAllConfirm(false);
            alert('All sessions have been deleted.');
        } catch (err) {
            console.error("❌ handleDeleteAllSessions error:", err);
            setError(`Failed to delete all sessions: ${err.message}`);
        } finally {
            setIsDeletingAll(false);
        }
    };

    // Multi-select handlers
    const handleSelectSession = (e, id) => {
        e.stopPropagation();
        setSelectedSessions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedSessions.size === sessions.length) {
            setSelectedSessions(new Set());
        } else {
            setSelectedSessions(new Set(sessions.map(s => s.id)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedSessions.size === 0) return;

        if (!showDeleteSelectedConfirm) {
            setShowDeleteSelectedConfirm(true);
            return;
        }

        console.log("🗑️ handleDeleteSelected starting for:", Array.from(selectedSessions));
        setIsDeletingSelected(true);
        setError(null);

        try {
            // Delete each selected session
            const deletePromises = Array.from(selectedSessions).map(id =>
                api.deleteSession(id)
            );
            await Promise.all(deletePromises);

            console.log("✅ handleDeleteSelected success");
            setSessions(sessions.filter(s => !selectedSessions.has(s.id)));
            setSelectedSessions(new Set());
            setSelectedSession(null);
            setShowDeleteSelectedConfirm(false);
        } catch (err) {
            console.error("❌ handleDeleteSelected error:", err);
            setError(`Failed to delete selected sessions: ${err.message}`);
        } finally {
            setIsDeletingSelected(false);
        }
    };

    const handleExportSession = async (id) => {
        console.log("📥 handleExportSession starting for:", id);
        try {
            const data = await api.exportSession(id);
            console.log("✅ handleExportSession success");
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `session-${id}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("❌ handleExportSession error:", err);
            setError(err.message);
        }
    };

    const handleTranscribeSession = async (e, id) => {
        e.stopPropagation();
        console.log("🎙️ handleTranscribeSession starting for:", id);
        setTranscribingId(id);
        setError(null);

        try {
            const result = await api.transcribeSession(id);
            console.log("✅ handleTranscribeSession success:", result);

            // Update the session in state with the transcript
            setSessions(sessions.map(s =>
                s.id === id ? { ...s, transcript: result.transcript } : s
            ));

            // Update selected session if open
            if (selectedSession?.id === id) {
                setSelectedSession({ ...selectedSession, transcript: result.transcript });
            }
        } catch (err) {
            console.error("❌ handleTranscribeSession error:", err);
            setError(`Transcription failed: ${err.message}`);
        } finally {
            setTranscribingId(null);
        }
    };

    const handleDownloadPdf = async (e, id) => {
        e.stopPropagation();
        console.log("📄 handleDownloadPdf starting for:", id);
        setGeneratingPdfId(id);
        setError(null);

        try {
            const result = await api.generateTranscriptPdf(id);
            console.log("✅ handleDownloadPdf success:", result);

            // Open PDF in new tab for download
            window.open(result.pdf_url, '_blank');
        } catch (err) {
            console.error("❌ handleDownloadPdf error:", err);
            setError(`PDF generation failed: ${err.message}`);
        } finally {
            setGeneratingPdfId(null);
        }
    };

    const handleRenameSession = async (id) => {
        if (!editTitle.trim()) return;
        console.log("✏️ handleRenameSession starting for:", id, "to:", editTitle);
        setIsUpdating(true);
        try {
            const updated = await api.updateSession(id, { title: editTitle });
            console.log("✅ handleRenameSession success:", updated);
            setSessions(sessions.map(s => s.id === id ? updated : s));
            setEditingId(null);
            if (selectedSession?.id === id) {
                setSelectedSession(updated);
            }
        } catch (err) {
            console.error("❌ handleRenameSession error:", err);
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const startEditing = (e, session) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const cancelEditing = (e) => {
        e.stopPropagation();
        setEditingId(null);
        setEditTitle('');
    };

    const getAudioUrl = (session) => {
        if (!session.notes) return null;
        // The mobile recorder saves File ID in notes
        const match = session.notes.match(/File ID: ([a-f0-9-]+)/);
        if (match && match[1]) {
            const fileId = match[1];
            // Hardcoded for now based on AI server address
            // In production this would be an env variable
            return `http://127.0.0.1:8000/uploads/${fileId}_recording.webm`;
        }
        return null;
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="sessions-page">
            <Navbar />

            <main className="page">
                <div className="container">
                    <header className="sessions-header">
                        <div className="sessions-header-left">
                            <h1 className="page-title">Sessions</h1>
                            <p className="page-description">Manage your voice capture sessions</p>
                            {user?.email && (
                                <div className="user-badge" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                                    Logged in as: <strong>{user.email}</strong>
                                </div>
                            )}
                        </div>
                        <div className="sessions-header-actions" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {sessions.length > 0 && (
                                <div className="delete-all-wrapper">
                                    {showDeleteAllConfirm && (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setShowDeleteAllConfirm(false)}
                                            disabled={isDeletingAll}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`btn btn-danger ${isDeletingAll ? 'btn-deleting' : ''} ${showDeleteAllConfirm ? 'btn-confirm-delete' : ''}`}
                                        onClick={handleDeleteAllSessions}
                                        disabled={isDeletingAll}
                                    >
                                        {isDeletingAll ? 'Deleting...' : showDeleteAllConfirm ? 'Confirm Delete All?' : 'Delete All'}
                                    </button>
                                </div>
                            )}
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCreateModal(true)}
                                disabled={isDeletingAll}
                            >
                                + New Session
                            </button>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="sessions-filters">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="input search-input"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="input mode-select"
                            value={selectedMode}
                            onChange={(e) => setSelectedMode(e.target.value)}
                        >
                            <option value="">All Modes</option>
                            {Array.isArray(modes) && modes.map(mode => (
                                <option key={mode.id} value={mode.slug}>{mode.name}</option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="sessions-error">
                            {error}
                        </div>
                    )}

                    {/* Selection Actions Bar */}
                    {sessions.length > 0 && (
                        <div className="selection-bar">
                            <label className="select-all-label" onClick={handleSelectAll}>
                                <input
                                    type="checkbox"
                                    checked={selectedSessions.size === sessions.length && sessions.length > 0}
                                    onChange={handleSelectAll}
                                    className="session-checkbox"
                                />
                                <span>Select All</span>
                            </label>
                            {selectedSessions.size > 0 && (
                                <div className="selection-actions">
                                    <span className="selected-count">{selectedSessions.size} selected</span>
                                    {showDeleteSelectedConfirm && (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setShowDeleteSelectedConfirm(false)}
                                            disabled={isDeletingSelected}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`btn btn-danger btn-sm ${isDeletingSelected ? 'btn-deleting' : ''} ${showDeleteSelectedConfirm ? 'btn-confirm-delete' : ''}`}
                                        onClick={handleDeleteSelected}
                                        disabled={isDeletingSelected}
                                    >
                                        {isDeletingSelected ? 'Deleting...' : showDeleteSelectedConfirm ? `Confirm Delete ${selectedSessions.size}?` : 'Delete Selected'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sessions List */}
                    {loading ? (
                        <div className="flex items-center justify-center" style={{ padding: 'var(--space-16)' }}>
                            <div className="spinner-lg"></div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎙️</div>
                            <h3 className="empty-state-title">No sessions yet</h3>
                            <p className="empty-state-description">
                                Create your first voice capture session to get started.
                            </p>
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create Session
                            </button>
                        </div>
                    ) : (
                        <div className="sessions-list">
                            {sessions.map((session, index) => (
                                <div
                                    key={session.id}
                                    className={`session-card glass-card ${selectedSessions.has(session.id) ? 'session-selected' : ''}`}
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                    onClick={() => setSelectedSession(session)}
                                >
                                    <input
                                        type="checkbox"
                                        className="session-checkbox"
                                        checked={selectedSessions.has(session.id)}
                                        onChange={(e) => handleSelectSession(e, session.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="session-mode-icon" style={{
                                        background: `${session.mode?.color || '#6366f1'}20`,
                                        color: session.mode?.color || '#6366f1'
                                    }}>
                                        {modeIcons[session.mode?.slug] || '🎙️'}
                                    </div>
                                    <div className="session-info">
                                        <div className="session-title-container">
                                            {editingId === session.id ? (
                                                <div className="edit-title-group" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="text"
                                                        className="input edit-title-input"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button
                                                        className="btn btn-primary btn-xs"
                                                        onClick={() => handleRenameSession(session.id)}
                                                        disabled={isUpdating}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost btn-xs"
                                                        onClick={cancelEditing}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <h3 className="session-title">{session.title}</h3>
                                            )}
                                        </div>
                                        <div className="session-meta">
                                            <span className="session-mode">{session.mode?.name || 'Unknown'}</span>
                                            <span className="session-separator">•</span>
                                            <span className="session-duration">{formatDuration(session.duration)}</span>
                                            <span className="session-separator">•</span>
                                            <span className="session-date">{formatDate(session.createdAt)}</span>
                                        </div>
                                        {getAudioUrl(session) && (
                                            <div className="session-audio-player" onClick={(e) => e.stopPropagation()}>
                                                <audio controls src={getAudioUrl(session)}>
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        )}
                                        {session.notes && (
                                            <div className="session-notes-preview">
                                                {session.notes.length > 120
                                                    ? `${session.notes.substring(0, 120)}...`
                                                    : session.notes}
                                            </div>
                                        )}

                                        {/* Transcript Display */}
                                        {session.transcript && (
                                            <div className="session-transcript">
                                                <div className="transcript-header">
                                                    <span className="transcript-label">📝 Transcript</span>
                                                    <button
                                                        className={`btn btn-accent btn-xs ${generatingPdfId === session.id ? 'btn-loading' : ''}`}
                                                        onClick={(e) => handleDownloadPdf(e, session.id)}
                                                        disabled={generatingPdfId === session.id}
                                                    >
                                                        {generatingPdfId === session.id ? '⏳ Generating...' : '📄 Download PDF'}
                                                    </button>
                                                </div>
                                                <p className="transcript-text">
                                                    {session.transcript.length > 200
                                                        ? `${session.transcript.substring(0, 200)}...`
                                                        : session.transcript}
                                                </p>
                                            </div>
                                        )}

                                        {/* Transcribe Button (show if audio exists but no transcript) */}
                                        {getAudioUrl(session) && !session.transcript && (
                                            <button
                                                className={`btn btn-accent btn-sm transcribe-btn ${transcribingId === session.id ? 'btn-loading' : ''}`}
                                                onClick={(e) => handleTranscribeSession(e, session.id)}
                                                disabled={transcribingId === session.id}
                                            >
                                                {transcribingId === session.id ? '🔄 Transcribing...' : '🎙️ Transcribe Audio'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="session-actions">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={(e) => startEditing(e, session)}
                                        >
                                            Rename
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExportSession(session.id);
                                            }}
                                        >
                                            Export
                                        </button>
                                        <button
                                            className={`btn btn-danger btn-sm ${deletingId === session.id ? 'btn-deleting' : ''} ${confirmDeleteId === session.id ? 'btn-confirm-delete' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSession(session.id);
                                            }}
                                            disabled={deletingId !== null || isDeletingAll}
                                        >
                                            {deletingId === session.id ? 'Deleting...' : confirmDeleteId === session.id ? 'Confirm?' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal glass-card-static" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create Session</h2>
                            <button className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>✕</button>
                        </div>
                        <form className="modal-form" onSubmit={handleCreateSession}>
                            <div className="input-group">
                                <label className="input-label">Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Session title"
                                    value={newSession.title}
                                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Mode</label>
                                <select
                                    className="input"
                                    value={newSession.modeId}
                                    onChange={(e) => setNewSession({ ...newSession, modeId: e.target.value })}
                                    required
                                >
                                    <option value="">Select mode...</option>
                                    {modes.map(mode => (
                                        <option key={mode.id} value={mode.id}>{mode.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Duration (seconds)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="0"
                                    min="0"
                                    value={newSession.duration}
                                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Notes</label>
                                <textarea
                                    className="input"
                                    placeholder="Session notes..."
                                    rows={3}
                                    value={newSession.notes}
                                    onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Session Detail Modal */}
            {selectedSession && (
                <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
                    <div className="modal modal-lg glass-card-static" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedSession.title}</h2>
                            <button className="btn btn-ghost" onClick={() => setSelectedSession(null)}>✕</button>
                        </div>
                        <div className="session-detail">
                            <div className="session-detail-meta">
                                <div className="detail-item">
                                    <span className="detail-label">Mode</span>
                                    <span className="detail-value" style={{ color: selectedSession.mode?.color }}>
                                        {modeIcons[selectedSession.mode?.slug]} {selectedSession.mode?.name}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Duration</span>
                                    <span className="detail-value">{formatDuration(selectedSession.duration)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Created</span>
                                    <span className="detail-value">{formatDate(selectedSession.createdAt)}</span>
                                </div>
                            </div>
                            {selectedSession.notes && (
                                <div className="session-detail-notes">
                                    <h4>Notes</h4>
                                    <p>{selectedSession.notes}</p>
                                </div>
                            )}
                            {selectedSession.transcript && (
                                <div className="session-detail-transcript">
                                    <h4>Transcript</h4>
                                    <p>{selectedSession.transcript}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExportSession(selectedSession.id)}
                            >
                                Export
                            </button>
                            <button
                                className={`btn btn-danger ${deletingId === selectedSession.id ? 'btn-deleting' : ''} ${confirmDeleteId === selectedSession.id ? 'btn-confirm-delete' : ''}`}
                                onClick={() => handleDeleteSession(selectedSession.id)}
                                disabled={deletingId !== null || isDeletingAll}
                            >
                                {deletingId === selectedSession.id ? 'Deleting...' : confirmDeleteId === selectedSession.id ? 'Confirm?' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

        </div>
    );
}

export default Sessions;
