import { diskStorage } from 'multer';
import * as uniqueFilename from 'unique-filename';

const normalizeFilename = (req, file, callback) => {
  const fileExtName = file.originalname.split('.').pop();

  callback(null, `${uniqueFilename('')}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: './uploads',
  filename: normalizeFilename,
});
