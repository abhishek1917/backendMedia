import {Router} from "express";
import registerUser from "../controller/user.controller.js";
import {upload} from "../middlewares/multer.uploadOnDisk.js"

const router = Router()

router.route("/register").post(
    upload.fields(
        [
            {
                name:"avtar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1
            }
        ]
    ),
    registerUser)

export default router 