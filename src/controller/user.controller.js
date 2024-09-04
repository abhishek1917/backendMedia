import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/User.model.js"
import uploadOnClodinary from "../utils/clodinary.uploadFile.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
        //get user detail from frontend
        //validation-not empty
        //check if user is already exist: from user name or email
        //check images and avtar
        //upload to cloudnery
        //create user object create entry in db
        //remove password and refresh token field from response
        //check for user creation
        //return response

          const { fullname,email,username,password }= req.body     //jub kabhi hamere server pe post request ayegi to hum use req.body se access kar sakte hai
                   console.log("email:" ,email
                  ,"password:" ,password )

    // if(fullname===""){
    //   throw new ApiError(400,"Full name is required")
    // } or

    if([fullname,email,username,password].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"all field are  required")
    }

     const   existedUSer=  await User.findOne({
             $or:[{username},{email}]
         })

    if(existedUSer){
      throw new ApiError(409,"user with username and email already exist")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
  //  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath ;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath = req.files.coverImage[0].path
  }   //we doing this in this way becouse we do not want to throw error from this this will be the optional


   if(!avatarLocalPath){
    console.log("mere joota japani")
    throw new ApiError(400,"avatar image is required")
   }

   const avatar= await uploadOnClodinary(avatarLocalPath) 
   const coverImage= await uploadOnClodinary(coverImageLocalPath) 

   if(!avatar){
    throw new ApiError(400,"avatar image is required")
   }
   

   const user= await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
 })
  

  const createdUser= await  User.findById(user._id).select(
    "-password -refreshTocken"   //here we write what we do not want
  )

  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully") 
  )
   
})

const loginUser = asyncHandler(async (req,res)=>{
     //req-body -> data
     //userName and email
})


export {registerUser,loginUser}; 