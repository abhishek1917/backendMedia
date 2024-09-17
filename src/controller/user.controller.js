import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/User.model.js"
import uploadOnClodinary from "../utils/clodinary.uploadFile.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken" 

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

     const   existedUser=  await User.findOne({
             $or:[{username},{email}]
         })

    if(existedUser){
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

const refreshAccessToken =asyncHandler(async (req,res)=>{
  const  incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError (400,"unauthorized request")
  }

 try {
  const decodedToken  = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
  const user = await User.findById(decodedToken?._id)
  if(!user){
   throw new ApiError(401,"invalid refresh token")
  }
 
  if(incomingRefreshToken  !==user?.refreshToken){
   throw new ApiError(401," refresh token is used or time limit reached")
  }
 
  const options ={
   httpOnly: true,
   secure:true
  }
    
   const {accessToken,newRefreshToken} = generateAccessandRefreshTokens(user?._id)
 
   return res
   .secure(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
     new ApiResponse(
       200,
       {accessToken,refreshToken:newRefreshToken},
       "access token refresh successfully"
     )
   )
 } catch (error) {
     throw new ApiError( 401,error?.message || "invalid refresh token")
 }

})

const changeCurrentPassword =asyncHandler(async (req,res)=>{
  const {oldPassword,newPassword}=req.body //ye dono hame user se milenge
  
  const user = User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(401,"the password is not ccorrect")
  }

  user.password=newPassword

    await user.save({validateBeforeSave:false})


    return res.status(200)
    .json(new ApiResponse(
      200,
      {},
      "password change succesfully"
    ))


})

const getCurrentUser =  asyncHandler(async (req,res)=>{
  return res.status(200)
  .json(new ApiResponse(
    200,
    req.user,
    "current user fetch succefully"
  )) 
})

const updateAccountDetails =asyncHandler(async (req,res)=>{
    const {fullname,email}= req.body

    if(!(fullname || email)){
      throw new ApiError(400,"all field are required")
    }

    const user = User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullname,   //or we can write as fullname: fullname
          email:email,
        }
      },
      {new :true} //sari cheeze update karne ke bad ye hame nayi value ko return kar dega
     ).select("-password")

     return res.status(200).json(new ApiResponse(200,user,"Accout details updated succesfully"))
})

//getCurrentUser,updateAccountDetails,changeCurrentPassword to hame kaise req.body ka access yahan mil raha hai to ye hame jab ham in function ko use karenge to jwt.verify ko pehle 
//pre function  use karenge jaise ki hamne yahan kiya hai ****router.route("/logout").post(verifyJWT,logoutUser)****   verifyJWT ye hame access deta hai user ka .
 

const updateUserAvatar = asyncHandler(async (req,res)=>{

  const avatarLocalPath = req.files?.avatar[0]?.path

  if(!avatarLocalPath){
    throw new ApiError(401,"there is no local file path for avatar")
  }

  const avatar = await uploadOnClodinary(avatarLocalPath);

  if(!avatar.url){
    throw new ApiError(401,"error while uploading avatar")
  }
  
   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new: true}
   ).select("-password")

    
   return res
   .status(200)
   .json(
    new ApiResponse(200,user,"avatar Updated succefully")
   )
})

const updateUserCoverImage = asyncHandler(async (req,res)=>{


  const coverImageLocalPath = req.file?.path   //files ka access hame tabhi milta hai jab hum multer middleware use karte hai  or yahan hum log sirf file use karenge  insted of files 

  if(!coverImageLocalPath){
    throw new ApiError(401,"there is no local file path missing cover image")
  }

  const coverImage = await uploadOnClodinary(coverImageLocalPath);

  if(!coverImage.url){
    throw new ApiError(401,"error while uploading cover image")
  }
  
  const user= await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new: true}
   ).select("-password")


   return res
   .status(200)
   .json(
    new ApiResponse(200,user,"coverImage Updated succefully")
   )


})


const getUserChannelProfile = asyncHandler(async (req,res)=>{
  const username = req.params 

  if(!username?.trim()){
    throw new ApiError (
      401,"username does not exist "
    )
  }

  const channel = User.aggregate(
    [
      {
        $match:{
          username:username.toLowerCase()
        }
      },
      {
            $lookup:{
              from:"subscription",
              localField:_id,
              foreignField:"subscriber",
              as:"subscriberTo"
            }
      },
      {
        $addFields:{
          subscribersCount:{
            $size:"$subscribers"
          },
          channelSubscribeTocount:{
            $size:"$subscriberTo"
          },
          isSubscribed:{
            $cond:{
              if:{$in:[req.user?._id,"$subscribers.subscriber"]},
              then:true,
              else:false
            }
          }
       }
      },

      {
        $project:{
          fullname:1,
          username:1,
          subscribersCount:1,
          channelSubscribeTocount:1,
          avatar:1,
          coverImage:1,
          email:1
        }
      }
    ]
  )


  if(!channel.length){
    throw new ApiError(401,"channel does not exist")
  }

  return res
  .status(200
  .json(
    new ApiResponse(
      200,
      channel[0],
      "user channel fetched succefully"
    )
  )
  )

})


const getWatchedHistory =asyncHandler(async (req,res)=>{
  const user =await User.aggregate([
    {
      $match :{
        _id: new mongoose.Types.ObejectId(req.user._id)   //kis model ki id ka use karke hame connect karna hai apni pipeline ko
      }
    },
    {
      $lookup:{
        from:"video",   //kis model me look up karna hai ya dekhna hai
        localField: "watchHistory",  //kis local field ko hame obsever karna hai jo bhi madel me hum look up kar rahen hai
        foreignField:"_id" , //upside field kya hai hamari
        as:"watchHistory",   //abb hame ye sara document mil gaya hai or hum use nam dete hai watch history
             
          //yahan par hamare pas watchhistory me videos  ka ek document ban gaya hai jo ki watch history me store hai but hame chahiye kya ki hum owner ka data chahiye to wo to owner ke  ke andar store hai (objectid user) ke form me jo basically user hi hai
          //yahan hum log inbuild pipeline ka istemal karenge  owner ke andar se user  ko access karne ke liye

          pipeline:[
            {
              $lookup:{
                 from:"users",
                 localField:"owner",
                 foreignField:"_id",
                 as:"owner",
                 pipeline:[
                      {   //yahan hum log ise bahar bhi likh sakte the magar yahan par hum ye dekh rahe hai ki jo hamara owner field hai usme data bahit sara hai use controll karna seekh rahe hai
                        $project:{
                          fullname:1,
                          username:1,
                          avatar:1,
                        }
                      }
                 ]
              }
            } ,
            //sara deta owner ke field me hai or yahan mere pass array aya hai or hum us array ko sudharna chahte hai
            {
              $addFields:{
                //yahan humne iska nam owner rakhan hai kuch or bhi rakh sakte hai magar agar humne nam same hi rahan hai to ye over ride ho jayega 
                  owner:{
                    $first:"$owner"  //yahan hum log first element nikal rahen hai 
                  }
              }
            }
          ]

     
     
      }
    }

  ])

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      user[0].watchHistory ,
      "watch history fetch succefully"
    )
  )
})




export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,
  updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchedHistory}; 