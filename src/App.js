import React, { useState, useEffect } from "react";
import styles from "./App.module.css";

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // hold note being edited
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  // Add new note
  const addNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    const newNote = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
    };
    setNotes([newNote, ...notes]);
    setNewTitle("");
    setNewContent("");
    setSelectedNoteId(newNote.id);
    setCreatingNew(false);
  };

  // Update existing note
  const updateNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    setNotes(
      notes.map((note) =>
        note.id === editingNote.id ? { ...note, title: newTitle, content: newContent } : note
      )
    );
    setNewTitle("");
    setNewContent("");
    setEditingNote(null);
    setSelectedNoteId(editingNote.id);
  };

  // Delete note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (id === selectedNoteId) setSelectedNoteId(null);
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  // Cancel editing or creating new note
  const cancelEdit = () => {
    setNewTitle("");
    setNewContent("");
    setEditingNote(null);
    setCreatingNew(false);
    if (selectedNote) setSelectedNoteId(selectedNote.id);
  };

  // Start editing selected note
  const startEdit = (note) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setCreatingNew(false);
  };

  return (
    <div className={styles.appContainer}>
      <aside className={styles.sidebar}>
        <h2>📝 Notes</h2>
        <button
          className={styles.newNoteButton}
          onClick={() => {
            setCreatingNew(true);
            setEditingNote(null);
            setSelectedNoteId(null);
            setNewTitle("");
            setNewContent("");
          }}
        >
          + New Note
        </button>

        <ul className={styles.noteList}>
          {notes.map((note) => (
            <li
              key={note.id}
              className={`${styles.noteItem} ${selectedNoteId === note.id ? styles.active : ""}`}
              onClick={() => {
                setSelectedNoteId(note.id);
                setCreatingNew(false);
                setEditingNote(null);
              }}
            >
              {note.title || "Untitled"}
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.main}>
        {(creatingNew || editingNote) ? (
          <div className={styles.noteFormContainer}>
            <h3>{editingNote ? "Update Note" : "Create a New Note"}</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Take a note..."
              rows={10}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className={styles.textarea}
            />
            <div className={styles.buttonRow}>
              {editingNote && (
                <button className={styles.cancelButton} onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              <button
                className={styles.button}
                onClick={editingNote ? updateNote : addNote}
              >
                {editingNote ? "Update" : "Save"} Note
              </button>
            </div>
          </div>
        ) : selectedNote ? (
          <div className={styles.noteViewContainer}>
            <div className={styles.noteHeader}>
              <h2 className={styles.viewTitle}>{selectedNote.title}</h2>
              <div className={styles.iconGroup}>
                <button
                  className={styles.iconButton}
                  onClick={() => startEdit(selectedNote)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => deleteNote(selectedNote.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className={styles.viewContent}>{selectedNote.content}</p>
          </div>
        ) : (
          <div className={styles.noSelection}>
            <p>Select a note to view or click "New Note" to create</p>
          </div>
        )}
      </main>
    </div>
  );
}
