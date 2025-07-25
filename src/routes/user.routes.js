import {Router} from "express";


import {loginUser, registerUser,logoutUser,refreshAccessToken, 
    changeCurrentPassword, getCurrentUser, updateAccountDetails, 
    updateUserAvatar, updateUserCoverImage, getUserChannelProfile,
     getWatchedHistory} from "../controller/user.controller.js";


import {upload} from "../middlewares/multer.uploadOnDisk.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1
            }
        ]
    ),
    registerUser)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar-update").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/coverImage-update").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

//upload.single("coverIage") ye multer ka ek function hai jo sirf single file ko upload karne ke liye use hota hai or bracket me sirf or sirf nam hai jo hum kuch bhi rakh sakte hai


router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchedHistory)

export default router
