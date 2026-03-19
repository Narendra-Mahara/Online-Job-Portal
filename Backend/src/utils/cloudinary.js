import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config(process.env.CLOUDINARY_URL);
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // Upload the image
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "careerforge",
    });
    console.log("File is successfully uploaded", response.url);
    //remove file from server
    fs.unlinkSync(localFilePath);
    return response.secure_url;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error(error);
    return null;
  }
};

export default uploadOnCloudinary;
