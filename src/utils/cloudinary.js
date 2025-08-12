import { v2 as cloud } from "cloudinary";
import fs from 'fs';

dotenv.config()
    cloud.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload file to cloudinary
        const response = await cloud.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        console.log("File uploaded to cloudinary successfully",response);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}
     
export default uploadOnCloudinary