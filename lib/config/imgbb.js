// lib/config/imgbb.js
export const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export async function uploadImageToImgBB(imageFile) {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }

    return data.data.url;
  } catch (error) {
    console.error("ImgBB API error:", error);
    throw new Error(`ImgBB upload error: ${error.message}`);
  }
}