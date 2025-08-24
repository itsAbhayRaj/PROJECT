import { v2 as cloud } from "cloudinary";
import fs from "fs";

cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("cloudinsry",process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file to cloudinary
    const response = await cloud.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Only delete the file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading to cloudinary:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteOnCloudinary = async (url) => {
  try {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/"); 
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.split(".")[0];
    const response = await cloud.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.error("Error deleting from cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
