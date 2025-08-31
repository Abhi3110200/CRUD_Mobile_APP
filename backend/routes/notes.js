import express from "express";
const router = express.Router();
import { getNotes, getNote, createNote, updateNote, deleteNote } from "../controller/notesController.js";

router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
