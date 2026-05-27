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
 * @desc    Get all projects with search and filters
 * @route   GET /api/projects?search=react&techStack=TypeScript&status=active&lookingFor=Designer
 * @access  Public
*/
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    // Build query object
    const query: any = {};

    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by tech stack
    if (req.query.techStack) {
      query.techStack = { $in: [req.query.techStack] };
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by looking for
    if (req.query.lookingFor) {
      query.lookingFor = { $in: [req.query.lookingFor] };
    }

    const projects = await Project.find(query)
      .populate('creator', 'username email avatar')
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

/**
 * @desc    Join a project
 * @route   POST /api/projects/:id/join
 * @access  Private
*/
export const joinProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const alreadyMember = project.members.some(
      (member) => member.toString() ===  req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project',
      });
    }

    project.members.push(req.user._id);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('creator', 'username email avatar')
      .populate('members', 'username avatar skills');

    res.status(200).json({
      success: true,
      message: 'Successfully joined the project',
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
 * @desc    Leave a project
 * @route   POST /api/projects/:id/leave
 * @access  Private
*/
export const leaveProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the creator
    if (project.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Project creator cannot leave the project. Delete it instead.',
      });
    }

    // Check if user is a member
    const isMember = project.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this project',
      });
    }

    // Remove user from members
    project.members = project.members.filter(
      (member) => member.toString() !== req.user._id.toString()
    );
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left the project',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};