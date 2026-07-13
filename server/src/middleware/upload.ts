import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Request } from "express";
import { createError } from "./errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SERVER_ROOT = path.join(__dirname, "..", "..");

// Tipos de archivo permitidos
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Determinar carpeta según tipo de archivo
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, path.join(SERVER_ROOT, "uploads", "images"));
    } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      cb(null, path.join(SERVER_ROOT, "uploads", "documents"));
    } else {
      cb(createError("Tipo de archivo no permitido", 400), "");
    }
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Generar nombre único con timestamp y extensión original
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Filtro de archivos
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      createError(
        `Tipo de archivo no permitido: ${file.mimetype}. Use JPG, PNG, GIF, WebP o PDF.`,
        400
      )
    );
  }
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB máximo
    files: 5, // Máximo 5 archivos por request
  },
});

// Middleware para upload de una sola imagen
export const uploadSingleImage = upload.single("image");

// Middleware para upload de múltiples imágenes
export const uploadMultipleImages = upload.array("images", 5);

// Middleware para upload de imagen + campos de formulario
export const uploadImageWithFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Middleware para upload de documento
export const uploadDocument = upload.single("document");

export default upload;
