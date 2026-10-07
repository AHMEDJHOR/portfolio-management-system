import { Router } from 'express';
import {
  createForBlog,
  listAll,
  listForBlog,
  remove,
  update,
} from '../controllers/comment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { commentRateLimiter } from '../middlewares/rateLimit.js';
import { validateBody } from '../middlewares/validate.js';
import { createCommentSchema, updateCommentSchema } from '../schemas/comment.schema.js';

const router = Router();

// Public
router.get('/blog/:blogId', listForBlog);
router.post('/blog/:blogId', commentRateLimiter, validateBody(createCommentSchema), createForBlog);

// Admin only
router.get('/', requireAuth, listAll);
router.put('/:id', requireAuth, validateBody(updateCommentSchema), update);
router.delete('/:id', requireAuth, remove);

export default router;