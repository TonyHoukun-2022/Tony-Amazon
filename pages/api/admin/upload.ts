import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { isAuth, isAdmin } from '../../../utils/auth';
import { onError } from '../../../utils/error';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
});
const upload = multer()

handler.use(isAuth, isAdmin, upload.single('file')).post(async (req, res) => {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.json(result);
  });

export default handler;