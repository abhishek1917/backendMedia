import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "json-web-token"
import { User } from "../models/User.model.js";

export const verifyJWT =asyncHandler(async (req,_,next)=>{
    //here we replace res with _ here becouse it does not have any use 
   try {
     const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw new ApiError(401,"unauthorized request")
     }
    
    const decodedToken= jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)  //jab ye verify ho jayega tab hame decoded information mil jayegi
 
    const user = await User.findById(decodedToken?._id).select(" -password -refreshToken")
 
    if(!user){
     throw new ApiError(401,"invalid access Token")
    }
     
 
     req.user=user //we are adding new object inside req name is user and putting the value of our user inside of that user
 
     next()
   } catch (error) {
       throw new ApiError(401,error?.message || "invalid access token")
   }
})