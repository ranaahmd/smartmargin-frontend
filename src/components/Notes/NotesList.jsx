import React, { useState ,useEffect} from 'react';
import Note from './Note';
import AddNote from './AddNote';
import { nanoid } from 'nanoid';
import Search from './Search';
import Header from './Header';

export default function NotesList({ initialNotes }) {
    const [notes, setNotes] = useState(initialNotes || [{ 
        id: nanoid(),
        text: "this is my first note",
        date: "31/10/2025"
    },
    {
        id: nanoid(),
        text: "this is my second note",
        date: "1/11/2025"
    }]);
    const [searchText, setSearchText] = useState('');
    const [darkMode,setDarkMode] =useState(false)


    const handleAddNote = (text) => {
        const newNote = {
            id: nanoid(),
            text: text,
            date: new Date().toLocaleDateString() 
        };
        setNotes([...notes, newNote]);
    }

    const deleteNote = (id) => {
        const newNotes = notes.filter((note) => note.id !== id); 
        setNotes(newNotes);
    }

    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchText.toLowerCase())
    );
    
    return (
        <div className={`${darkMode && 'dark-mode'}`}>
        <div className='notes-container'>
         <Header handleToggleDarkMode={setDarkMode}/>
            <Search handleSearchNote={setSearchText} />
            
            
            <div className='notes-list'> 
                {filteredNotes.map((note) => (
                    <Note 
                        key={note.id}  
                        id={note.id} 
                        text={note.text} 
                        date={note.date} 
                        handleDeleteNote={deleteNote} 
                    />
                ))}
                <AddNote handleAddNote={handleAddNote} /> 
            </div>
            </div>
        </div>
    );
}