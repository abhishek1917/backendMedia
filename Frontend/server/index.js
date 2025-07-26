import express from 'express'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, '../.env')
})

const app = express()

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

// API Routes
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter)

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')))
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'))
    })
}

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Full-stack Vite app is working!' })
})

const PORT = process.env.PORT || 5000

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables")
    process.exit(1)
}

connectDB()
.then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Full-stack server running at http://localhost:${PORT}`)
        console.log(`✅ API available at http://localhost:${PORT}/api/v1`)
    })
})
.catch((err) => {
    console.log(`❌ MongoDB connection error: ${err}`)
    process.exit(1)
})