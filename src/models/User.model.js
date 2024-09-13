import mongoose  ,{ Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken" 
  

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    avatar:{
        type:String, //cloudnery url
        required:true,
    },
    coverImage:{
        type: String, //cloudnery url
        required:true,
    },


    password:{
        type:String,
        required:[true,"password is required only in no."]
    },

    watchHistory: [
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],

    refreshToken :{
        type: String
    }


},  {timestamps:true})
//here we are trying to make ur password sequare before it is going to be in database as this is the function which will going to run first 


UserSchema.pre("save", async function (next) {
     
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    //console.log("bycrpt compare of the password:", this.password)
    next()
})

UserSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
     {
         _id: this._id,
         email:this.email,
         username:this.username,
         fullname:this.fullname
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
     }
    )
 }
 

UserSchema.methods.generateRefreshToken = function(){
   return  jwt.sign (
    {
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}


UserSchema.methods.isPasswordCorrect = async function (password){
      console.log("bycrpt compare of the password:",password,this.password)
    return await bcrypt.compare(password,this.password)
}   // here we can see we are injecting the method name is password is correct which will going to return the true or false value in future

export const User = mongoose.model("User",UserSchema)


