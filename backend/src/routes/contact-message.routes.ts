import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/contact-message.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createContactMessageSchema,
  updateContactMessageSchema,
} from '../schemas/contact-message.schema.js';

const router = Router();

// Public
router.post('/', validateBody(createContactMessageSchema), create);

// Admin only
router.get('/', requireAuth, getAll);
router.get('/:id', requireAuth, getById);

router.put(
  '/:id',
  requireAuth,
  validateBody(updateContactMessageSchema),
  update,
);

router.delete('/:id', requireAuth, remove);

export default router;
