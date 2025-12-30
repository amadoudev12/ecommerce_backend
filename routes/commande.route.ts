import { Router } from "express"
import { createCommande, getCommandes, UpdateCommande } from "../controllers/commande.controller.js"
import verifyToken from "../middleware/verifyToken.js"
const commandeRoute = Router()
commandeRoute.get('/',getCommandes)
commandeRoute.post('/',verifyToken,createCommande)
commandeRoute.patch('/:id',UpdateCommande)
export default commandeRoute