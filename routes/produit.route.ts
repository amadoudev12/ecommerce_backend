import { Router } from "express";
import upload from "../middleware/uploadImage.js";
import { createProduit } from "../controllers/produit.controller.js";

const produitRoute = Router()
produitRoute.post('/',upload.single('image'),createProduit)
export default produitRoute