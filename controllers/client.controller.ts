import { type Request, type Response } from 'express'
import bcrypt from "bcrypt"
import type {client} from '../types/mytypes.js'
import {prisma} from '../lib/prisma.js'
import  Jwt  from 'jsonwebtoken'

const ma_cle_secret = process.env.MA_CLE_SECRET
const clientGet = async (req:Request, res:Response) => {
    try{
        const clients = await prisma.client.findMany()
        return res.json({message:"les utilisateurs", clients}).status(201)
    }catch(err){
        console.log(err)
        return res.json({message:'erreur au niveau de la base de données'}).status(500)  
    }
}

const inscription = async (req:Request, res:Response) => {
    try{
        const {nom,prenom,email,telephone, mot_de_passe, adresse} : client = req.body
        if(!req.body){
            return res.json({message:'veuillez remplir tous les champs'}).status(404)
        }
        const userExixtant = await prisma.client.findUnique({
            where:{email:email}
        })
        if(userExixtant){
            return res.json({Message:"l'utilisateur est deja enregistre ou du moins cet email est deja utilise"}).status(401)
        }
        const saltRound:number = 10
        const motPasseHasher = await bcrypt.hash(mot_de_passe, saltRound)
        console.log(motPasseHasher)
        const client = await prisma.client.create({
            data : {
                nom:nom,
                prenom:prenom,
                email:email,
                telephone:telephone,
                mot_de_passe:motPasseHasher,
                adresse:adresse
            }
        })
        return res.json({message:"vous etes inscrit",client}).status(201)
    }catch(err){
        console.log(err)
        return res.json({message:'erreur au niveau de la base de données',err}).status(500)
    }
}

const login = async(req:Request, res:Response)=>{
    try{
        if(!req.body){
            return res.json({message:'veuillez remplir tous les champs'}).status(404)
        }
        const {email, mot_de_passe} = req.body
        const existUser = await prisma.client.findUnique({
            where: {email:email}
        })
        if(!existUser){
            return res.json({message:"veuillez vous inscrire avant"}).status(401)
        }
        const motPasseHasherCompare = await bcrypt.compare(mot_de_passe, existUser.mot_de_passe)
        if(!motPasseHasherCompare){
            return res.json({message:"mot de passe incorrect"}).status(404)
        }
        const role = "client"
        if(existUser.email == "amadoughost2004@gmail.com"){
            const role = "admin"
        }
        const token = Jwt.sign({
            id:existUser.id,
            nom:existUser.nom,
            prenom:existUser.prenom,
            email:existUser.email,
            telephone:existUser.telephone,
            adresse:existUser.adresse,
            role:role
        }, ma_cle_secret as string, {expiresIn:"7d"})
        return res.json({message:`Bienvenue M. ${existUser.nom}`, token}).status(201)
    }catch(err){
        console.log(err)
        return res.json({message:'erreur eu niveau de la base de données',err}).status(500)
    }
}
const modifierInfo = async(req:Request, res:Response)=> {
    try{
        const id:number = Number(req.params.id)
        if(!req.body || !id){
            return res.json({message:'veuillez remplir tous les champs'}).status(404)
        }
        const body = req.body
        const modClient = await prisma.client.update({
            where:{id:id},
            data:body
        })
        if(modClient){
            return res.json({message:'modifié',modClient}).status(201)
        }
    }catch(err){
        console.log(err)
        return res.json({message:'erreur eu niveau de la base de données',err}).status(500) 
    }
}
const supClient = async(req:Request, res:Response)=> {
    try{
        const id:number = Number(req.params.id)
        if(!id){
            return res.json({message:"aucun identifiant "})
        }
        const clientSup = await prisma.client.delete({
            where:{id:id},
            include:{commandes:true}
        })
        return res.json({message:'Client Supprime avec succes'})
    }catch(err){
        console.log(err)
        return res.json({message:'erreur eu niveau de la base de données',err}).status(500) 
    }
}
export {clientGet,inscription, login, modifierInfo, supClient}