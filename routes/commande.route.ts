import { Router } from "express"
import { createCommande, getCommandes, UpdateCommande } from "../controllers/commande.controller.js"
import verifyToken from "../middleware/verifyToken.js"
const commandeRoute = Router()
commandeRoute.get('/',verifyToken,getCommandes)
commandeRoute.post('/',verifyToken,createCommande)
commandeRoute.patch('/:id',verifyToken,UpdateCommande)
export default commandeRoute