import mongoose from "mongoose";
import  bcrypt from " bcrypt";
import jwt from "jsonweb token"

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
    coverpage:{
        type: String, //cloudnery url
        required:true,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],

    passward:{
        type:String,
        required:[true,"password is required"]
    },

    refreshToken :{
        type: String
    }


},  {timestamps:true})
//here we are trying to make ur password sequare 
UserSchema.pre("save", async function (next) {
     
    if(!this.isModified("passward")) return next();

    this.passward=  await bcrypt.hash(this.passward,10)
    next()
})


UserSchema.methods.isPasswordCorrect = async function (passward){
    return await bcrypt.compare(passward,this.passward)
}

export const User = mongoose.model("User",UserSchema)


