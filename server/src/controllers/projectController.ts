import {Request, Response} from 'express';
import Project from '../models/Project';

/**
 * @desc    create new project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (req: Request, res: Response) => {
    try {
        const {name, description, techStack, lookingFor, repositoryUrl, liveUrl} = req.body;

        // validate required fields
        if (!name || !description || !techStack) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, description, and techStack',
            });
        }

        //create project with authenticated user as creator
        const project = await Project.create({
            name,
            description,
            techStack,
            creator: req.user._id,
            members: [req.user._id],
            lookingFor: lookingFor || [],
            repositoryUrl,
            liveUrl,
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
};

/**
 * @desc     Get all projects
 * @route    GET /api/projects
 * @access   Public
*/
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find()
        .populate('creator', 'username email avatar')
        .populate('members', 'username avatar')
        .sort({ createdAt: -1});
        
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
*/
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'username email avatar bio skills')
      .populate('members', 'username avatar skills');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (only creator)
*/
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the creator
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    // Update fields
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (only creator)
*/
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the creator
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Get current user's projects
 * @route   GET /api/projects/my-projects
 * @access  Private
*/
export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ creator: req.user._id })
      .populate('members', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};