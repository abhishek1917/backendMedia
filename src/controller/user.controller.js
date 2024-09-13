import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/User.model.js"
import uploadOnClodinary from "../utils/clodinary.uploadFile.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshTokens= async (userId) =>
  {
try {
    const user =await User.findById(userId)

    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }

    const accessToken =user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    

    console.log("Generated access token:", accessToken);
    console.log("Generated refresh token:", refreshToken);


        user.refreshToken = refreshToken   //i am storing the refresh tocken to our database 
     await user.save({validateBeforeSave :false})  //and after storing the refresh token in database it stored we have save this  to database validateBeforeSave: false Mongoose is used to skip validation checks
    //user.save({ validateBeforeSave: false });

    console.log("Tokens saved to user:", user);

     return {accessToken , refreshToken}
} catch (error) {
  console.error("Error in generateAccessandRefreshTokens:", error);
  throw new ApiError(500,"something went wrong while genrating refresh and access tocken")
}
}

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
    password, //: await bcrypt.hash(password, 10)
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
     //find the user
     //password check
     //access and refresh tocken
     //send cookies

     const {email,username,password} = req.body;

     if(!(username || email)){
      throw new ApiError (400,"username or email is required")
     }

     const user = await User.findOne({
      $or:[{username} ,{email}]
     })

     if(!user){
      throw new ApiError(404,"user does not exist")
     }

     const isPasswordisValid= await user.isPasswordCorrect(password);

     if(!isPasswordisValid){
      console.log(isPasswordisValid)
      console.log("boolean value",assword)
      throw new ApiError(401,"invalid user credential mainly password is not")
     }

       const {accessToken,refreshToken} =await generateAccessandRefreshTokens(user._id)

       const loggedInUser =await User.findById(user._id).select("-password -refreshTocken ")

       const options={
           httpOnly: true,
           secure:true
       }   // hame jab bhi cookies bhejne hote hai to hame kuch option define karne hote hai 
           //jo hamari cookies hoti hai by defoult use koi bhi modify kar deta hai frontend me  we have to avoid this
           //jab bhi humhttpOnly: true, secure:true  to ye cookies kewal server se modifiable hoti hai

       return res.status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
        new ApiResponse(200,
          {
            user:loggedInUser,accessToken,refreshToken
          },
          "User logged in successfully"
        )
       )
     
   

     
})


const logoutUser =asyncHandler(async (req,res)=>{

       await User.findByIdAndUpdate(
        req.user._id, {
          $set: {
            refreshToken: undefined
          }
        },
        {
          new: true   //is code ya function ke exicute hone ke bad jo return me hame value milegi wo new updated value milegi
        }
      )
      const options={
        httpOnly: true,
        secure:true
       } 

       return res.status(200).clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse (200,{},"user logged o"))
       
      
})


export {registerUser,loginUser,logoutUser}; 