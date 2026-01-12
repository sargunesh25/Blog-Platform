const Note = require("../models/note");


// CREATE Note
exports.createNote = async (req, res) => {
  try {
    const newNote = await Note.create({ text: req.body.note });
    res.json({ message: "Note added ✅", note: newNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ Notes
exports.getNotes = async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
};

// DELETE Note
exports.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted ✅" });
};
