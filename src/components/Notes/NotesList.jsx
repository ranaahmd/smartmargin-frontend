import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRequest, getTokens, clearTokens } from '../../lib/auth';
import Header from './Header';
import Search from './Search';
import NoteCard from './Note';
import NoteEditor from './NoteForm';
import { CardSkeleton } from '../Skeleton';
import littlemer from '../../assets/littlemer.png';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function NotesList() {
    const [notes, setNotes] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const navigate = useNavigate();

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (productFilter) params.set('product', productFilter);
            const qs = params.toString();
            const response = await authRequest({ method: 'GET', url: `${API_BASE}/notes/${qs ? `?${qs}` : ''}` });
            setNotes(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
                return;
            }
            setError('Could not load your notes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [search, productFilter, navigate]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await authRequest({ method: 'GET', url: `${API_BASE}/products/` });
            setProducts(response.data);
        } catch {
            // Product list only backs the link/filter dropdowns.
        }
    }, []);

    useEffect(() => {
        if (!getTokens().access) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [fetchProducts, navigate]);

    useEffect(() => {
        const timer = setTimeout(fetchNotes, 300);
        return () => clearTimeout(timer);
    }, [fetchNotes]);

    const deleteNote = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await authRequest({ method: 'DELETE', url: `${API_BASE}/notes/${id}/` });
            fetchNotes();
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
                return;
            }
            setError('Could not delete this note. Please try again.');
        }
    };

    const togglePin = async (note) => {
        try {
            await authRequest({
                method: 'PUT',
                url: `${API_BASE}/notes/${note.id}/`,
                data: { title: note.title, content: note.content, pinned: !note.pinned, product: note.product },
            });
            fetchNotes();
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
                return;
            }
            setError('Could not update this note. Please try again.');
        }
    };

    return (
        <div className="bg-[#2d2d2d] min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
                    <div className="flex flex-wrap gap-3">
                        <Search value={search} onChange={setSearch} />
                        <select
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className="bg-amber-200 rounded-full px-4 py-2 text-sm text-gray-900"
                        >
                            <option value="">All products</option>
                            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <button
                        className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                        onClick={() => setEditingNote({})}
                    >
                        + Add Note
                    </button>
                </div>

                {loading ? (
                    <CardSkeleton />
                ) : error ? (
                    <div className="bg-red-100 text-red-800 rounded-2xl p-8 text-center">
                        <p className="mb-4">{error}</p>
                        <button className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full hover:bg-[#444]" onClick={fetchNotes}>
                            Retry
                        </button>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="bg-amber-200 rounded-2xl p-8 text-center">
                        <img src={littlemer} alt="No notes" className="w-32 h-32 mx-auto mb-4 object-cover rounded-lg" />
                        <p className="text-gray-700 text-lg mb-4">
                            {search || productFilter ? 'No notes match your search.' : 'No notes yet.'}
                        </p>
                        <button className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full hover:bg-[#444]" onClick={() => setEditingNote({})}>
                            Write Your First Note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={() => setEditingNote(note)}
                                onDelete={() => deleteNote(note.id)}
                                onTogglePin={() => togglePin(note)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {editingNote && (
                <NoteEditor
                    note={editingNote}
                    products={products}
                    onClose={() => setEditingNote(null)}
                    onSaved={() => { setEditingNote(null); fetchNotes(); }}
                />
            )}
        </div>
    );
}
