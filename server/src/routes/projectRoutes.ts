import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected routes
router.post('/', protect, createProject);
router.get('/my/projects', protect, getMyProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;