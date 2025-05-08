import { v2 as cloudinary } from "cloudinary";  

cloudinary.config({
            cloud_name: 'dwsjjzetv',
            api_key: '877219746183432',
            api_secret: 'qj0R8QeD6ESqapY2DHxEIQniSzM',
});

export const uploadFileToCloudinary = async (
    filePath,
    folder,
    height,
    quality
) => {
    try {
        const options = { folder };

        if (height) {
            options.height = height;
        }

        if (quality) {
            options.quality = quality;
        }

        options.resource_type = "auto";

        const response = await cloudinary.uploader.upload(filePath, options);

        return response;
    } catch (error) {
        console.log("Error in uploading file to cloudinary", error.message);
        return;
    }
};
