
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')



const userSchema=new mongoose.Schema({
    name: {
        type:String,
        required:[true,'please provide a name'],
        minlength:3,
        maxlength:50
        
    },
    email: {
        type:String,
        required:[true,'please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
          unique: true,
    },
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:6,
    }
})

userSchema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
})

// another approach we can create token using instances method from mongoose
userSchema.methods.createJWTToken=function(){
    const token=jwt.sign({userName:this.name,userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    return token;
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
  }

module.exports=mongoose.model('User',userSchema)