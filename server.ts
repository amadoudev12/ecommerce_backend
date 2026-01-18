import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();
import express from 'express'
import clientRoute from './routes/client.route.js'
import produitRoute from "./routes/produit.route.js";
import commandeRoute from "./routes/commande.route.js";
const port : number = 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/upload', express.static('upload'))
app.use('/client',clientRoute)
app.use('/produit',produitRoute)
app.use('/commande',commandeRoute)
app.listen(port,()=> console.log('server on'))