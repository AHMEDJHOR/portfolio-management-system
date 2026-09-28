import { Router } from 'express';
import {
  getAll,
  getBySlug,
  create,
  update,
  remove,
} from '../controllers/project.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../schemas/project.schema.js';

const router = Router();

// Public
router.get('/', getAll);
router.get('/:slug', getBySlug);

// Admin only
router.post('/', requireAuth, validateBody(createProjectSchema), create);

router.put('/:id', requireAuth, validateBody(updateProjectSchema), update);

router.delete('/:id', requireAuth, remove);

export default router;
