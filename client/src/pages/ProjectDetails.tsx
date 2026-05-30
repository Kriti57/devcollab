import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Divider,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { projectService } from '../services/projectService';
import type { Project } from '../types';

// useParams: Gets URL parameters
// We use this to know WHICH project to fetch!
export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  // Gets the project ID from the URL
  // If URL is /projects/65f8a1b2c3d4
  // Then id = "65f8a1b2c3d4"

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  // joining: Loading state specifically for join button
  const [joinMessage, setJoinMessage] = useState('');
  // Success/error message after joining

  const navigate = useNavigate();

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  // We saved user data during login
  // Parse it back from JSON string to object

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjectById(id!);
        // id! means "id is definitely not null" (TypeScript)
        setProject(response.data);
      } catch (err: any) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
    // Only fetch if id exists
  }, [id]);
  // Re-fetch if id changes (navigating between projects)

  // Check if current user is already a member
  const isMember = project?.members.some(
    (member: any) => member._id === currentUser._id
  );
  // .some() checks if ANY member matches condition
  // Returns true if current user is in members array

  // Check if current user is the creator
  const isCreator = project?.creator._id === currentUser._id;

  const handleJoin = async () => {
    try {
      setJoining(true);
      setJoinMessage('');
      await projectService.joinProject(id!);
      setJoinMessage('Successfully joined the project! 🎉');
      
      // Refresh project data to show updated members
      const response = await projectService.getProjectById(id!);
      setProject(response.data);
    } catch (err: any) {
      setJoinMessage(err.response?.data?.message || 'Failed to join project');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      setJoining(true);
      await projectService.leaveProject(id!);
      setJoinMessage('You have left the project');
      
      // Refresh project data
      const response = await projectService.getProjectById(id!);
      setProject(response.data);
    } catch (err: any) {
      setJoinMessage(err.response?.data?.message || 'Failed to leave project');
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this project? This cannot be undone!'
  );
  // window.confirm: Shows a browser popup with OK/Cancel

  if (!confirmed) return;

  try {
    setJoining(true);
    await projectService.deleteProject(id!);
    // Call backend DELETE /api/projects/:id

    navigate('/dashboard');
  } catch (err: any) {
    setJoinMessage(err.response?.data?.message || 'Failed to delete project');
  } finally {
    setJoining(false);
  }
};

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error if fetch failed
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // Show 404 if project not found
  if (!project) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Project not found!</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* NAVBAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project Details
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>

        {/* PROJECT HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            {project.name}
          </Typography>

          {/* Status chip */}
          <Chip
            label={project.status.toUpperCase()}
            color={
              project.status === 'active' ? 'success' :
              project.status === 'completed' ? 'default' :
              project.status === 'on-hold' ? 'warning' : 'primary'
            }
            sx={{ mb: 2 }}
          />
          {/* Chip color changes based on status:
              active → green
              completed → gray
              on-hold → yellow/orange
              planning → blue (primary) */}
        </Box>

        <Divider sx={{ mb: 3 }} />
        {/* Divider: Horizontal line separator */}

        {/* DESCRIPTION */}
        <Typography variant="h5" gutterBottom>
          About This Project
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {project.description}
        </Typography>
        {/* paragraph: Adds bottom margin automatically */}

        <Divider sx={{ mb: 3 }} />

        {/* TECH STACK */}
        <Typography variant="h5" gutterBottom>
          Tech Stack
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {project.techStack.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* LOOKING FOR */}
        {project.lookingFor.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Looking For
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {project.lookingFor.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Divider sx={{ mb: 3 }} />
          </>
        )}
        {/* Conditional rendering: Only show if lookingFor has items */}

        {/* CREATOR */}
        <Typography variant="h5" gutterBottom>
          Created By
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={project.creator.avatar}
            alt={project.creator.username}
          />
          {/* Avatar: Shows user profile picture */}
          <Typography variant="body1">
            {project.creator.username}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* MEMBERS */}
        <Typography variant="h5" gutterBottom>
          Members ({project.members.length})
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AvatarGroup max={5}>
            {/* AvatarGroup: Shows multiple avatars overlapping */}
            {/* max={5}: Shows max 5 avatars, rest shown as "+X" */}
            {project.members.map((member: any) => (
              <Avatar
                key={member._id}
                src={member.avatar}
                alt={member.username}
              />
            ))}
          </AvatarGroup>
          <Box>
            {project.members.map((member: any) => (
              <Typography key={member._id} variant="body2">
                {member.username}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* LINKS */}
        {(project.repositoryUrl || project.liveUrl) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Links
            </Typography>
            {project.repositoryUrl && (
              <Button
                variant="outlined"
                href={project.repositoryUrl}
                target="_blank"
                sx={{ mr: 2 }}
              >
                GitHub Repository 🔗
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="outlined"
                href={project.liveUrl}
                target="_blank"
              >
                Live Demo 🌐
              </Button>
            )}
          </Box>
        )}

        {/* JOIN/LEAVE/DELETE BUTTON */}
        {joinMessage && (
        <Alert
            severity={joinMessage.includes('Failed') ? 'error' : 'success'}
            sx={{ mb: 2 }}
        >
            {joinMessage}
        </Alert>
        )}

        {/* CREATOR ACTIONS */}
        {isCreator && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
            You are the creator of this project!
            </Alert>
            <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={joining}
            size="large"
            sx={{ whiteSpace: 'nowrap' }}
            >
            {joining ? (
                <CircularProgress size={24} />
            ) : (
                '🗑️ Delete Project'
            )}
            </Button>
        </Box>
        // whiteSpace: 'nowrap': Prevents button text from wrapping
        )}

        {/* MEMBER ACTIONS */}
        {!isCreator && (
        isMember ? (
            <Button
            variant="outlined"
            color="error"
            onClick={handleLeave}
            disabled={joining}
            size="large"
            >
            {joining ? <CircularProgress size={24} /> : 'Leave Project'}
            </Button>
        ) : (
            <Button
            variant="contained"
            onClick={handleJoin}
            disabled={joining}
            size="large"
            >
            {joining ? <CircularProgress size={24} /> : 'Join This Project 🚀'}
            </Button>
        )
        )}
      </Container>
    </Box>
  );
}