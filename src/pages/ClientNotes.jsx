"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  StickyNote,
  Loader2,
} from "lucide-react";

const ClientNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClientData();
    }
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/clients/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setClient(result.data);
        setNotes(result.data.notes || []);
      } else {
        throw new Error("Client not found");
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note: newNote.trim() }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setNotes([...notes, newNote.trim()]);
        setNewNote("");
        setIsAddingNote(false);
        if (window.showToast) {
          window.showToast("Note added successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      if (window.showToast) {
        window.showToast(`Failed to add note: ${error.message}`, "error");
      }
    }
  };

  const handleEditNote = async (index, updatedNote) => {
    if (!updatedNote.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${id}/notes/${index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note: updatedNote.trim() }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedNotes = [...notes];
        updatedNotes[index] = updatedNote.trim();
        setNotes(updatedNotes);
        setEditingNote(null);
        if (window.showToast) {
          window.showToast("Note updated successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      if (window.showToast) {
        window.showToast(`Failed to update note: ${error.message}`, "error");
      }
    }
  };

  const handleDeleteNote = async (index) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${id}/notes/${index}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedNotes = notes.filter((_, i) => i !== index);
        setNotes(updatedNotes);
        if (window.showToast) {
          window.showToast("Note deleted successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      if (window.showToast) {
        window.showToast(`Failed to delete note: ${error.message}`, "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <span className="block mt-2 text-gray-600">
            Loading client notes...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/clients")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Clients</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Client Notes</h1>
            {client && <p className="text-gray-600">{client.full_name}</p>}
          </div>
        </div>

        {/* Client Info Card */}
        {client && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                {client.img_dir ? (
                  <img
                    src={`http://localhost:5000/uploads/${client.img_dir}`}
                    alt={client.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-600">
                    {client.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {client.full_name}
                </h2>
                <p className="text-gray-600">{client.mail}</p>
                <p className="text-gray-600">+216 {client.phone_number}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Note Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            <button
              onClick={() => setIsAddingNote(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>

          {/* Add New Note Form */}
          {isAddingNote && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write a new note about this client..."
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No notes yet</p>
                <p className="text-gray-400">
                  Add your first note about this client
                </p>
              </div>
            ) : (
              notes.map((note, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {editingNote === index ? (
                    <EditNoteForm
                      note={note}
                      onSave={(updatedNote) =>
                        handleEditNote(index, updatedNote)
                      }
                      onCancel={() => setEditingNote(null)}
                    />
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {note}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingNote(index)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Note Form Component
const EditNoteForm = ({ note, onSave, onCancel }) => {
  const [editedNote, setEditedNote] = useState(note);

  return (
    <div>
      <textarea
        value={editedNote}
        onChange={(e) => setEditedNote(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex justify-end space-x-2 mt-3">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <button
          onClick={() => onSave(editedNote)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default ClientNotes;
