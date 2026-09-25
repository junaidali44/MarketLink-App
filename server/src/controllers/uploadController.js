import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, fail } from '../utils/response.js';
import { uploadBuffer } from '../services/cloudinaryService.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, 'No file uploaded');
  if (!process.env.CLOUDINARY_CLOUD_NAME)
    return ok(res, { url: '' }, 'Cloudinary not configured');
  const result = await uploadBuffer(req.file.buffer);
  return ok(res, { url: result.secure_url }, 'Uploaded');
});