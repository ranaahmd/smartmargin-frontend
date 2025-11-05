import React, { useState, useEffect } from "react";
import { authRequest } from "../../lib/auth";

export default function AddNote({ handleAddNote }) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const characterLimit = 200;
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await authRequest({
          method: "GET",
          url: "http://127.0.0.1:8000/api/notes/",
        });
        setNotes(response.data || []);
      } catch (error) {
        console.error("Failed to load notes", error);
      }
    };
    fetchNotes();
  }, []);
//copied from conor
  useEffect(() => {
    const saveNotes = async () => {
      try {
        for (const note of notes) {
          if (!note.id) {
            await authRequest({
              method: "POST",
              url: "http://127.0.0.1:8000/api/notes/",
              data: { content: note.text },
            });
          }
        }
      } catch (error) {
        console.error("Failed to sync notes", error);
      }
    };
    if (notes.length > 0) {
      saveNotes();
    }
  }, [notes]);

  const handleChange = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  };

  const handleSaveClick = () => {
    if (noteText.trim().length > 0) {
      const newNote = { text: noteText.trim() };
      setNotes((prev) => [...prev, newNote]);
      handleAddNote(noteText);
      setNoteText("");
    }
  };

  return (
    <div className="note new">
      <textarea
        rows="8"
        cols="10"
        placeholder="Type to add a note"
        value={noteText}
        onChange={handleChange}
      ></textarea>
      <div className="note-footer">
        <small>{characterLimit - noteText.length} Remaining</small>
        <button className="save" onClick={handleSaveClick}>
          Save
        </button>
      </div>
    </div>
  );
}
