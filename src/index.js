
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

// Add environment check
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port: ${process.env.PORT || 5000}`)
    })
})
.catch((err) => {
    console.log(`MongoDB connection error: ${err}`)
    process.exit(1)
})



// const app = express()

// (async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error",(err)=>{
//         console.log("Error",err)
//         throw err;
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(` app is listning to a port ${process.env.PORT}`)
//        })
//     }

//     catch (err) {
//         console.log("error",err)
//         throw err
//     }
// })()
