import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'complaints/')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const upload = multer({
    dest: 'complaints/',
    storage:storage,
    limits:{fileSize:5*1024*1024}
})