export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  techStack: string[];
  creator: User;
  members: User[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  lookingFor: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
}