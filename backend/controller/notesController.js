import Note from "../models/NotesModel.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ pinned: -1, createdAt: -1 }); // pinned first
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newNote = new Note({ title, content, color, pinned });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false,
        message: "Title and content are required" 
      });
    }

    const updateData = { 
      title: title.trim(), 
      content: content.trim(),
      updatedAt: Date.now() 
    };

    // Only include color and pinned if they are provided
    if (color) updateData.color = color;
    if (pinned !== undefined) updateData.pinned = pinned;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ 
        success: false,
        message: "Note not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update note",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted", deletedNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
