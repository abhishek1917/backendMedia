import express, { Router } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app= express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

// Add a test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!' })
})

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users",userRouter)
            
export {app}
