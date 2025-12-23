import multer from 'multer'
import fs, { existsSync } from 'fs'
if(!existsSync('./upload')){
    fs.mkdirSync('./upload')
}

//configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})
export default upload