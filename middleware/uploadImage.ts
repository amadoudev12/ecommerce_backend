import multer from 'multer'
import fs, { existsSync } from 'fs'
import { extname } from 'path'
if(!existsSync('./upload')){
    fs.mkdirSync('./upload')
}

//configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (req,file,cb) => {
        const ext = extname(file.originalname)
        const nomProduit = req.body.nom
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        const uniqueFixe = Date.now() 
        const filename = `${nomProduit || 'produit'}-${uniqueFixe}${ext}`
        cb(null, filename)
    }
})
const upload = multer({storage})
export default upload