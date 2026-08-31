import React from 'react';
import { MdDeleteForever, MdEdit, MdPushPin, MdOutlinePushPin } from 'react-icons/md';
import { stripMarkdown } from '../../lib/markdown';

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
    const preview = stripMarkdown(note.content).slice(0, 140);

    return (
        <div className={`rounded-2xl shadow-lg p-5 flex flex-col ${note.pinned ? 'bg-amber-300' : 'bg-amber-200'}`}>
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
                <button onClick={onTogglePin} title={note.pinned ? 'Unpin' : 'Pin'} className="text-[#b6723c] shrink-0">
                    {note.pinned ? <MdPushPin size="1.3em" /> : <MdOutlinePushPin size="1.3em" />}
                </button>
            </div>

            {note.product_name && (
                <span className="inline-block bg-[#2d2d2d] text-amber-200 text-xs px-3 py-1 rounded-full mb-2 w-fit">
                    {note.product_name}
                </span>
            )}

            <p className="text-gray-700 text-sm flex-1 mb-3">
                {preview}{stripMarkdown(note.content).length > 140 ? '…' : ''}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-600">
                <span>{note.updated_at ? new Date(note.updated_at).toLocaleDateString() : ''}</span>
                <div className="flex gap-3">
                    <button onClick={onEdit} className="text-blue-700 hover:text-blue-900" title="Edit">
                        <MdEdit size="1.2em" />
                    </button>
                    <button onClick={onDelete} className="text-red-600 hover:text-red-800" title="Delete">
                        <MdDeleteForever size="1.2em" />
                    </button>
                </div>
            </div>
        </div>
    );
}
