import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/certification.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createCertificationSchema,
  updateCertificationSchema,
} from '../schemas/certification.schema.js';

const router = Router();

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Admin only
router.post('/', requireAuth, validateBody(createCertificationSchema), create);

router.put(
  '/:id',
  requireAuth,
  validateBody(updateCertificationSchema),
  update,
);

router.delete('/:id', requireAuth, remove);

export default router;
