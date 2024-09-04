import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const Bucket = process.env.AMPLIFY_BUCKET;
export const s3 = new S3Client({
  region: process.env.AWS_REGION_PHOTO,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_PHOTO as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_PHOTO as string,
  },
});

export async function uploadFileToS3(file: File, fileName: string) {
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
  
      //const fileBuffer = file;
      let actualFileName = `${fileName}-${Date.now()}`;

      if (file.type.startsWith('video/')) {
        actualFileName += '-video';
      }
  
      const params = {
        Bucket: process.env.AMPLIFY_BUCKET,
        Key: actualFileName,
        Body: fileBuffer,
        ContentType: file.type,
      };
  
      const command = new PutObjectCommand(params);
      await s3.send(command);
      return actualFileName;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  
  //To get objects and check for photos to delete, can we use GetObjectCommand?
  export async function deleteFileFromS3(fileName: string) {
    try {
      const deleteParams = {
        Bucket: process.env.AMPLIFY_BUCKET,
        Key: fileName,
      }
  
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3.send(deleteCommand);
    } catch(e) {
      console.log(e);
      return e;
    }
  }
  
  export async function getFileFromS3(fileName: string) {
    try {
      const getParams = {
      Bucket: process.env.AMPLIFY_BUCKET,
      Key: fileName,
    }
  
    const getFileCommand = new GetObjectCommand(getParams);
    const fileResponse = await s3.send(getFileCommand);
  
    return fileResponse;
    } catch(e) {
      console.log(e);
      return;
    }
  }