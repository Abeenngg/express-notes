import { Router } from "express";

import { 
    createNote, 
    viewNote, 
 
   
} from "../controller/notes.controller.js";

const router = Router();

//CRUD
router.post("/", createNote);
router.get("/:id", viewNote);


export default router;
