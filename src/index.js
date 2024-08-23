
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path:"./env"
})

connectDB()
.then(
    ()=>{
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`server is running at port : ${process.env.PORT}`)
        })
    }
)
.catch(
    (err)=>{
        console.log(` this is the error ${err}`)
        throw err
    }
)










 

















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