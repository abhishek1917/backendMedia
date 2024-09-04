import mongoose  ,{ Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "json-web-token"

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
     
    if(!this.isModified("passward")) return next();

    this.passward =  await bcrypt.hash(this.passward,10)
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
   return  jwt.sign(
    {
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expireIn: process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}


UserSchema.methods.isPasswordCorrect = async function (passward){
    return await bcrypt.compare(passward,this.passward)
}   // here we can see we are injecting the method name is password is correct which will going to return the true or false value in future

export const User = mongoose.model("User",UserSchema)


