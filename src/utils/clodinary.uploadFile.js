import { v2 as cloudinary } from 'cloudinary';

  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_NAME , 
});


const uploadOnClodinary=(localFilePath) => {
 
    try{
        if(!localFilePath) return null
       const response= cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
       console.log("file is uploaded on cloudinary",response.url)
       return response;
    }catch(error){
            console.log(err)
            fs.unlinkSync(localFilePath)

    }
   
}
