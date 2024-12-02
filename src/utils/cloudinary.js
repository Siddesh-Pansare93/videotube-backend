import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //uploading file 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        // console.log("File is uploaded on Cloudinary at : ", response.url);
        fs.unlinkSync(localFilePath) ;
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed 
        return null;
    }
}

const deleteFromCloudinary = async (fileUrl)=>{
    try {
        if(!fileUrl) return null ;
        console.log(fileUrl)

        const publicId = fileUrl.split('/').slice(-1)[0].split(".")[0];
        console.log("Public ID:", publicId);

        // Call Cloudinary's destroy method with the public ID
        const deleteResponse = await cloudinary.uploader.destroy(publicId);
        console.log("Response from Cloudinary:", deleteResponse);

        if(deleteResponse.result === "ok"){
        return 1 ;
        }else{
            return null
        }
    } catch (error) {
        return null     
    }
}
    
export { uploadOnCloudinary ,deleteFromCloudinary }