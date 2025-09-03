import React, { useEffect, useState } from "react";

const API_URL = "https://simplenotesapp-8.onrender.com/api/notes";



function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("id");

  // Load all notes
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setNotes(data);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const newNote = await res.json();
    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/delete/${id}`);
    const updated = await res.json();
    setNotes(updated);
  };

  const handleDeleteAll = async () => {
    await fetch(`${API_URL}/deleteAll`, { method: "DELETE" });
    setNotes([]);
  };

  const handleUpdate = async (id) => {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    if (!newTitle || !newContent) return;
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    const updated = await res.json();
    setNotes(notes.map((n) => (n.id === id ? updated : n)));
  };

  const handleUpdateTitle = async (id) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    const res = await fetch(`${API_URL}/updateTitle/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTitle),
    });
    const updated = await res.json();
    setNotes(notes.map((n) => (n.id === id ? updated : n)));
  };

  const handleUpdateContent = async (id) => {
    const newContent = prompt("Enter new content:");
    if (!newContent) return;
    const res = await fetch(`${API_URL}/updateContent/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent),
    });
    const updated = await res.json();
    setNotes(notes.map((n) => (n.id === id ? updated : n)));
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    let res;
    if (searchType === "id") {
      res = await fetch(`${API_URL}/${searchQuery}`);
      setNotes([await res.json()]);
    } else if (searchType === "title") {
      res = await fetch(`${API_URL}/title/${searchQuery}`);
      setNotes(await res.json());
    } else {
      res = await fetch(`${API_URL}/content/${searchQuery}`);
      setNotes(await res.json());
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>📒 Simple Notes App</h1>

      {/* Add Note */}
      <form
        onSubmit={handleAddNote}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", flex: "1", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ padding: "8px", flex: "2", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ background: "#3498db", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px" }}
        >
          ➕ Add
        </button>
      </form>

      {/* Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: "8px" }}>
          <option value="id">By ID</option>
          <option value="title">By Title</option>
          <option value="content">By Content</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", flex: "2", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSearch}
          style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px" }}
        >
          🔍 Search
        </button>
        <button
          onClick={loadNotes}
          style={{ background: "#95a5a6", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px" }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Delete All */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handleDeleteAll}
          style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px" }}
        >
          🗑️ Delete All Notes
        </button>
      </div>

      {/* Notes List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              background: "#f9f9f9",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 10px", color: "#34495e" }}>{note.title}</h3>
            <p style={{ color: "#555" }}>{note.content}</p>
            <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button onClick={() => handleUpdate(note.id)} style={btnStyle("#2980b9")}>
                ✏️ Update
              </button>
              <button onClick={() => handleUpdateTitle(note.id)} style={btnStyle("#8e44ad")}>
                📝 Title
              </button>
              <button onClick={() => handleUpdateContent(note.id)} style={btnStyle("#16a085")}>
                📄 Content
              </button>
              <button onClick={() => handleDelete(note.id)} style={btnStyle("#c0392b")}>
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable button style
const btnStyle = (bg) => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
  flex: "1",
});

export default App;
