import {Router} from "express";

import {loginUser, registerUser,logoutUser,refreshAccessToken, 
    changeCurrentPassword, getCurrentUser, updateAccountDetails, 
    updateUserAvatar, updateUserCoverImage, getUserChannelProfile,
     getWatchedHistory} from "../controller/user.controller.js";

import {upload} from "../middlewares/multer.uploadOnDisk.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// Add debug middleware
router.use((req, res, next) => {
    console.log(`🔍 User Route: ${req.method} ${req.path} - ${new Date().toISOString()}`)
    next()
})

router.route("/register").post(
    upload.fields([
        { name:"avatar", maxCount:1 },
        { name:"coverImage", maxCount:1 }
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)

// Debug: List all routes
console.log('📋 Registered user routes:')
console.log('  POST /register')
console.log('  POST /login')
console.log('  POST /logout')
console.log('  POST /refresh-token')
console.log('  GET /current-user')

export default router
