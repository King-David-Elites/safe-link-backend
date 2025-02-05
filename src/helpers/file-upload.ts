import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Relative to the project root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Example: 1683212321-123.jpeg
  },
});

const upload = multer({ storage });

export const uploadSingle = upload.single("file"); // Use this for single-file uploads
export const uploadMultiple = upload.array("files", 10); // Example for multiple files (limit: 10)
