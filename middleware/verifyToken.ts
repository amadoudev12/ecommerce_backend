import  Jwt  from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from 'express'
const ma_cle_secret = process.env.MA_CLE_SECRET
const  verifyToken = async(req:Request, res:Response, next:NextFunction)=> {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split('')[1]

        if(!token){
            return res.json({message:'vous etes pasautorisez a acceder a cette page'}).status(401)
        }
        const decodedToken = Jwt.verify(token , ma_cle_secret as string)
        req.user = decodedToken
        next()
    }catch(err){
        console.log('errerur au niveau des token',err);
        return res.json({message:'erreur',err})
    }
}

export default verifyToken