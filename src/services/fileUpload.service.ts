import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/r2";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const fileUploadService = {
  uploadFile: async (file: any): Promise<string> => {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const bucket = process.env.R2_BUCKET_NAME!;
    const publicUrl = process.env.R2_PUBLIC_URL!;

    try {
      // Compress image menggunakan sharp
      let fileBuffer = file.buffer;
      let quality = 80;

      if (file.mimetype.startsWith("image/")) {
        // Compress sampai ukuran dibawah limit
        while (fileBuffer.length > MAX_FILE_SIZE && quality > 10) {
          fileBuffer = await sharp(file.buffer)
            .resize(1920, 1080, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality })
            .toBuffer();

          quality -= 10;
        }

        // Jika masih lebih besar, resize lebih kecil
        if (fileBuffer.length > MAX_FILE_SIZE) {
          fileBuffer = await sharp(file.buffer)
            .resize(1280, 720, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 60 })
            .toBuffer();
        }

        // Final check
        if (fileBuffer.length > MAX_FILE_SIZE) {
          throw new Error(`File terlalu besar setelah kompres: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB`);
        }
      }

      console.log(`File size after compress: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB`);

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fileName,
          Body: fileBuffer,
          ContentType: file.mimetype,
        }),
      );

      // Gunakan public URL untuk akses
      const fileUrl = `${publicUrl}/${fileName}`;
      return fileUrl;
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  },
};

export default fileUploadService;
