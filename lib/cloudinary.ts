import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  imageUrl: string,
  folder = "luxe-retail/products",
): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder,
    transformation: [
      { width: 800, height: 800, crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
  return result.secure_url;
}

export async function uploadImages(
  imageUrls: string[],
  folder = "luxe-retail/products",
): Promise<string[]> {
  return Promise.all(imageUrls.map((url) => uploadImage(url, folder)));
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
