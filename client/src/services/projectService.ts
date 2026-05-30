import api from './api';

export interface CreateProjectData {
  name: string;
  description: string;
  techStack: string[];
  lookingFor?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
}

export const projectService = {
  // Get all projects with filters
  getAllProjects: async (filters?: any) => {
    const response = await api.get('/projects', { params: filters });
    return response.data;
  },

  // Get single project
  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Get your projects
  getMyProjects: async () => {
    const response = await api.get('/projects/my/projects');
    return response.data;
  },

  // Create project
  createProject: async (data: CreateProjectData) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update project
  updateProject: async (id: string, data: any) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Join project
  joinProject: async (id: string) => {
    const response = await api.post(`/projects/${id}/join`);
    return response.data;
  },

  // Leave project
  leaveProject: async (id: string) => {
    const response = await api.post(`/projects/${id}/leave`);
    return response.data;
  },
};