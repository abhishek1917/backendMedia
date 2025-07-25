import express, { Router } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app= express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173", "http://localhost:5174"],
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

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url} - ${new Date().toISOString()}`)
    next()
})

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter)

// Add catch-all route for debugging
app.use('*', (req, res) => {
    console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`)
    res.status(404).json({ 
        message: 'Route not found',
        method: req.method,
        url: req.originalUrl,
        availableRoutes: [
            'GET /test',
            'POST /api/v1/users/register',
            'POST /api/v1/users/login',
            'POST /api/v1/users/logout',
            'POST /api/v1/users/refresh-token',
            'GET /api/v1/users/current-user'
        ]
    })
})
            
export {app}
