import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/r2";
import { v4 as uuidv4 } from "uuid";

const fileUploadService = {
  uploadFile: async (file: any): Promise<string> => {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const bucket = process.env.R2_BUCKET_NAME!;
    const publicUrl = process.env.R2_PUBLIC_URL!;

    try {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fileName,
          Body: file.buffer,
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
