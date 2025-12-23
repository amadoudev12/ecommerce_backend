import { Router } from "express";
import { clientGet, inscription, login, modifierInfo, supClient } from "../controllers/client.controller.js";

const clientRoute = Router()

clientRoute.get('/',clientGet)
clientRoute.post('/',inscription)
clientRoute.post('/login',login)
clientRoute.put('/:id',modifierInfo)
clientRoute.delete('/:id',supClient)
export default clientRoute