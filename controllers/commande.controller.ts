import {  type Request, type Response} from 'express'
import { prisma } from '../lib/prisma.js'
import {type ligneCommandeT } from '../types/mytypes.js'

const getCommandes = async (req:Request, res:Response)=>{
    try{
        if(req.user.role !== "admin"){
            return res.json({message:'vous êtes pas administrateur'}).status(401)
        }
        const  commandes = await prisma.commande.findMany({
            include:{lignesCommande:true}
        })
        if(commandes.length <0){
            return res.json({message:"aucune commande trouve"}).status(404)
        }
        return res.json({message:"liste des commandes", commandes}).status(200)
    }catch(err){
        console.log(err);
        return res.json({message:'erreur au niveau de la bd', err})
    }
}
const createCommande = async(req:Request, res:Response)=>{
    try{
        if(req.user.role !== "admin"){
            return res.json({message:'vous êtes pas administrateur'}).status(401)
        }
        const body = req.body
        const {lignesCommande} = body
        let total:number = 0
        lignesCommande.forEach((element:ligneCommandeT) => {
            total = total+(element.quantite * element.prix_unitaire)
        })
        const idClient = req.user.id
        if(!body){
            return res.json({message:'aucune commande envoyée'}).status(404)
        }
        if(!idClient){
            return res.json({message:'veuilez vous enregistre'}).status(404)
        }
        const commande = await prisma.commande.create({
            data:{
                id_client:idClient,
                total:total,
                statut_commande:"en cours",
            }
        })
        for(let lignes of lignesCommande){
            await prisma.ligneCommande.create({
                data:{
                    id_commande:commande.id,
                    id_produit:lignes.id_produit,
                    quantite:lignes.quantite,
                    prix_unitaire:lignes.prix_unitaire
                }
            })
            const produit = await prisma.produit.findUnique({where:{id:lignes.id_produit}})
            if (!produit) {
                //throw new Error(`Produit avec id ${lignes.id_produit} non trouvé`);
                return res.json({message:`Produit avec id ${lignes.id_produit} non trouvé`}).status(404)
            }
            if(produit.stock < lignes.quantite){
                return res.json({message:`le produit ${produit.nom} est insuiffissant`})
            }
            const newStock = produit.stock - lignes.quantite
            await prisma.produit.update({
                where:{id:lignes.id_produit},
                data:{
                    stock: newStock
                }
            })
        }
            return res.json({message:"le commande a été enregistré"}).status(201)
    }catch(err){
        console.log(err);
        return res.json({message:'erreur au niveau de la bd', err})
    }
}

const UpdateCommande = async(req:Request, res:Response)=>{
    try{
        if(req.user.role !== "admin"){
            return res.json({message:'vous êtes pas administrateur'}).status(401)
        }
        const body = req.body
        await prisma.commande.update({
            where:{id:Number(req.params.id)},
            data:body
        })
        return res.json({message:`le statut est passé a ${body.statut_commande}`}).status(201)
    }catch(err){
        console.log(err);
        return res.json({message:'erreur au niveau de la bd', err})
    }
}

export {getCommandes,createCommande, UpdateCommande}