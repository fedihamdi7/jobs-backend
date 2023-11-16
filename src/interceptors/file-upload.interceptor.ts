import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';

export const FileUploadInterceptor = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let path = './assets/';
      if (file.fieldname === 'profilePic') {
        path += 'profile-pics';
      } else if (file.fieldname === 'resume') {
        path += 'resumes';
      }
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname.split('.');
      const extension = originalName[originalName.length - 1];
      const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
      const fileName = `${randomName}.${extension}`;
      file.originalname = fileName;
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePic' && !file.mimetype.startsWith('image/')) {
      return cb(new HttpException('Profile picture must be an image',HttpStatus.BAD_REQUEST));
    }
    cb(null, true);
  }
};