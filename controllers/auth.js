
const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError,UnauthenticatedError}=require('../errors')

const register=async(req,res)=>{

    const user=await User.create({...req.body})
    const token=user.createJWTToken()

    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})


}




const logIn=async(req,res)=>{

    const {email,password}=req.body
    if(!email || !password){
        throw new BadRequestError("please provide credentials")

    }
    const user=await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError("unvalid credentials")

    }
    const matchedPasswords= await user.comparePassword(password)

    if(!matchedPasswords){
        throw new UnauthenticatedError("unvalid credentials")   
    }
    const token= user.createJWTToken()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})

}



module.exports={register,logIn}