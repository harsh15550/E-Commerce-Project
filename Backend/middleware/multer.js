// uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // ✅ Correct for platforms like Vercel, Netlify, or cloud uploads
export const upload = multer({ storage });
