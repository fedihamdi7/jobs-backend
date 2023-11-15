import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

export const FileUploadInterceptor = FileInterceptor('profilePic', {
  storage: diskStorage({
    destination: './assets/profile-pics',
    filename: (req, file, cb) => {
      const originalName = file.originalname.split('.');
      const extension = originalName[originalName.length - 1];
      const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
      const fileName = `${randomName}.${extension}`;
      file.originalname = fileName;
      cb(null, fileName);
    }
  })
});