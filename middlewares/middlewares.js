import userModel from "../model/userSchema.js"
import jwt from 'jsonwebtoken'


export const userAuth = (req,res,next) => {
    try{
        let token = req.headers?.authorization
        if(token){
            jwt.verify(token,process.env.TOKEN_SECRET,(err,result)=>{
                if(err){
                    res.status(401).json({ authorization: false,message:'invalid token' })
                }else{
                    userModel.findOne({_id:result.userId}).then((user)=>{
                        if(user){
                            req.userLogged = user._id
                            next() 
                        }else{
                            res.status(401).json({ authorization: false,message:'invalid token' })
                        }
                    })
                }
            })
        }else{
            res.status(401).json({ authorization: false,message:'no token' })
        }
    }catch(err){
        res.status(500)
    }
}