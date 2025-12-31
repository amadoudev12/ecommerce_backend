import { Router } from "express";
import upload from "../middleware/uploadImage.js";
import verifyToken from "../middleware/verifyToken.js";
import { createProduit, getProduitById, getProduits } from "../controllers/produit.controller.js";

const produitRoute = Router()
produitRoute.get('/',getProduits)
produitRoute.post('/',verifyToken,upload.single('image'),createProduit)
produitRoute.get('/:id',getProduitById)
export default produitRoute