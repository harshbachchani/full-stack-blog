import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogProject" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

function getimagepublicid(url) {
  const parts = url.split("/");
  const public_id_segment = parts[parts.indexOf("upload") + 2]; // Get the segment after 'upload'
  // Further split the segment to extract the actual public ID
  const public_id_parts = public_id_segment.split(".");
  const public_id = public_id_parts[0];

  return public_id;
}
const deletefromCloudinary = async (clodinaryfilePath, resource_type) => {
  try {
    const public_id = getimagepublicid(clodinaryfilePath);
    const result = await cloudinary.api.delete_resources(public_id, {
      resource_type: resource_type || "image",
    });
    return result;
  } catch (error) {
    console.log("Error in deleting Cloudinary Image ", error);
    return null;
  }
};

export { uploadOnCloudinary, deletefromCloudinary };
