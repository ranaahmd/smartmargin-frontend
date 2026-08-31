import React, { useState, useEffect, useRef, useCallback } from 'react';
import { authRequest } from '../../lib/auth';
import { renderMarkdown } from '../../lib/markdown';

const API_BASE = 'http://127.0.0.1:8000/api';
const AUTOSAVE_DELAY = 1200;

export default function NoteEditor({ note, products, onClose, onSaved }) {
    const [noteId, setNoteId] = useState(note.id ?? null);
    const [title, setTitle] = useState(note.title ?? '');
    const [content, setContent] = useState(note.content ?? '');
    const [product, setProduct] = useState(note.product ?? '');
    const [pinned, setPinned] = useState(note.pinned ?? false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const textareaRef = useRef(null);
    const skipNextAutosave = useRef(true);

    const buildPayload = () => ({
        title: title.trim(),
        content,
        pinned,
        product: product || null,
    });

    const save = useCallback(async () => {
        if (!title.trim() && !content.trim()) return;
        try {
            setStatus('saving');
            setError('');
            if (noteId) {
                await authRequest({ method: 'PUT', url: `${API_BASE}/notes/${noteId}/`, data: buildPayload() });
            } else {
                const response = await authRequest({ method: 'POST', url: `${API_BASE}/notes/`, data: buildPayload() });
                setNoteId(response.data.id);
            }
            setStatus('saved');
        } catch {
            setStatus('');
            setError('Autosave failed — your changes are still here, try again.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteId, title, content, pinned, product]);

    useEffect(() => {
        if (skipNextAutosave.current) {
            skipNextAutosave.current = false;
            return;
        }
        const timer = setTimeout(save, AUTOSAVE_DELAY);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, content, pinned, product]);

    const applyFormatting = (type) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const { selectionStart, selectionEnd, value } = textarea;
        const selected = value.slice(selectionStart, selectionEnd);
        let insert = selected;
        if (type === 'bold') insert = `**${selected || 'bold text'}**`;
        if (type === 'heading') insert = `## ${selected || 'Heading'}`;
        if (type === 'list') insert = (selected || 'list item').split('\n').map((l) => `- ${l}`).join('\n');

        const next = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
        setContent(next);
        requestAnimationFrame(() => {
            textarea.focus();
            const cursor = selectionStart + insert.length;
            textarea.setSelectionRange(cursor, cursor);
        });
    };

    const handleDone = async (e) => {
        e.preventDefault();
        await save();
        onSaved();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-amber-200 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{noteId ? 'Edit Note' : 'New Note'}</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">
                            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : ''}
                        </span>
                        <button onClick={onClose} className="text-gray-700 hover:text-gray-900 text-2xl">×</button>
                    </div>
                </div>

                {error && <div className="bg-red-100 text-red-800 rounded-lg p-3 mb-4 text-sm">{error}</div>}

                <form onSubmit={handleDone} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full rounded-lg p-2 border border-gray-300 text-lg font-semibold"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <select
                            className="rounded-lg p-2 border border-gray-300 text-sm"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        >
                            <option value="">No linked product</option>
                            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <label className="flex items-center gap-2 text-sm text-gray-800">
                            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
                            Pinned
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <button type="button" onClick={() => applyFormatting('bold')} className="bg-white px-3 py-1 rounded border border-gray-300 font-bold text-sm">B</button>
                        <button type="button" onClick={() => applyFormatting('heading')} className="bg-white px-3 py-1 rounded border border-gray-300 text-sm">H</button>
                        <button type="button" onClick={() => applyFormatting('list')} className="bg-white px-3 py-1 rounded border border-gray-300 text-sm">• List</button>
                    </div>

                    <textarea
                        ref={textareaRef}
                        rows={8}
                        className="w-full rounded-lg p-3 border border-gray-300 font-mono text-sm"
                        placeholder="Write your note in markdown — **bold**, ## headings, - lists"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div>
                        <p className="text-xs text-gray-600 mb-1">Preview</p>
                        <div className="bg-white rounded-lg p-3 min-h-[60px]">{renderMarkdown(content)}</div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button type="button" className="bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600" onClick={onClose}>
                            Close
                        </button>
                        <button type="submit" className="bg-amber-500 text-white px-5 py-2 rounded-full hover:bg-amber-600">
                            Done
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
