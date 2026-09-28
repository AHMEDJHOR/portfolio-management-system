import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/blog.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import { createBlogSchema, updateBlogSchema } from '../schemas/blog.schema.js';

const router = Router();

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Admin only
router.post('/', requireAuth, validateBody(createBlogSchema), create);

router.put('/:id', requireAuth, validateBody(updateBlogSchema), update);

router.delete('/:id', requireAuth, remove);

export default router;
