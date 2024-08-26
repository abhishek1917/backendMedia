import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =new mongoose.Schema(
    {
        videoFile:{
            type:String, //clodnery url(work as aws for storing images and videos)
            required:true
        },
        thumbnail:{
            type:String, //clodnery url(work as aws for storing images and videos)
            required:true
        },
        title:{
            type:String,
            required:true
        },
        discription:{
            type:String,
            required:true
        },
        duration:{
            type:String, //basically time duration jo hai vo clodnery se hi milega 
            required:true
        },
        views:{
            type: Number,
            defoult:0
        },
        isPublished:{
            type: Boolean,
            defoult:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }

,{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)