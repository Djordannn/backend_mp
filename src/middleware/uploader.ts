import multer from "multer";
import path from "path";
import { Request } from "express";

export const uploader = (directory: string, filePrefix?: string) => {
  const defaultDir = path.join(__dirname, "../../public"); // define default directory

  const configureStoreFile = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) => {
      const fileDestination = defaultDir + directory;
      console.log("Destination File : ", fileDestination);

      callback(null, fileDestination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) => {
      const existName = file.originalname.split(".");
      console.log("Original Name : ", existName);
      const ext = existName[existName.length - 1];
      console.log("Ext name : ", ext);
      if (filePrefix) {
        const newName = `${filePrefix}${Date.now()}.${ext}`;
        callback(null, newName);
      } else {
        callback(null, file.originalname);
      }
    },
  });

  return multer({ storage: configureStoreFile });
};
