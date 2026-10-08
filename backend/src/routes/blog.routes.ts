import { Router } from 'express';
import {
  getAll,
  getBySlug,
  getById,
  create,
  update,
  remove,
} from '../controllers/blog.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import { createBlogSchema, updateBlogSchema } from '../schemas/blog.schema.js';

const router = Router();

// Public
router.get('/', optionalAuth, getAll);
router.get('/slug/:slug', optionalAuth, getBySlug);
router.get('/:id', optionalAuth, getById);

// Admin only
router.post('/', requireAuth, validateBody(createBlogSchema), create);

router.put('/:id', requireAuth, validateBody(updateBlogSchema), update);

router.delete('/:id', requireAuth, remove);

export default router;