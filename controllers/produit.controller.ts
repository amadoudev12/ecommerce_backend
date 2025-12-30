import {  type Request, type Response} from 'express'
import { prisma } from '../lib/prisma.js'

const getProduits = async(req:Request,res:Response)=>{
    try{
        const produits = await prisma.produit.findMany()
        res.json({message:'les produits', produits}).status(200)
    }catch(err){
        console.log(err)
        return res.json({message:'erreur eu niveau de la base de données',err}).status(500)
    }
}
const getProduitById = async (req:Request, res:Response)=>{
    try{
        const produitId = Number(req.params.id)
        const produit = await prisma.produit.findUnique({
            where:{id:produitId}
        })
        if(!produit){
            return res.json({message:"ce produit n'existe pas"}).status(404)
        }
        return res.json({message:'produit:', produit})
    }catch(err){
        console.log(err);
        return res.json({message:'erreur au niveau de la base de donnée'}).status(500)
    }
}
const createProduit = async(req:Request, res:Response)=> {
    try{
        //console.log("FILE 👉", req.file)
        if(!req.file){
            return res.json({message:'aucune image envoye'}).status(400)
        }
        if(!req.body){
            return res.json({message:'veuillez remplir les informations'}).status(400)
        }
        const {nom, description, prix, stock} = req.body

        const produit = await prisma.produit.create({
            data : {
                nom:nom,
                description:description,
                prix:Number(prix),
                stock:Number(stock),
                image:req.file.filename
            }
        })
        return res.json({message:'produit enregistre avec succes',produit}).status(201)
    }catch(err){
        console.log(err)
        return res.json({message:'erreur eu niveau de la base de données',err}).status(500)
    }
}

export {createProduit, getProduits, getProduitById}