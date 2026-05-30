import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { authService } from '../services/authService';
import { projectService } from '../services/projectService';
import type { User, Project } from '../types';

export default function Profile() {
  // Current saved profile data
  const [user, setUser] = useState<User | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);

  // Edit form fields
  // These are SEPARATE from user state!
  // user = current saved data
  // these = what's in the edit form
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // saving: separate from loading
  // loading = fetching data
  // saving = sending updated data

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // success: Show green message when profile updated

  const navigate = useNavigate();

  // Fetch user data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userResponse = await authService.getCurrentUser();
        const userData = userResponse.data;
        setUser(userData);

        // Pre-fill form with current values
        setBio(userData.bio || '');
        setAvatar(userData.avatar || '');
        setSkills(userData.skills || []);

        // Get user's projects
        const projectsResponse = await projectService.getMyProjects();
        setMyProjects(projectsResponse.data);

      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ADD SKILL
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // REMOVE SKILL
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // HANDLE ENTER KEY
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await authService.updateProfile({
        bio,
        avatar,
        skills,
      });

      // Update local user state with new data
      setUser(response.data);
      setSuccess('Profile updated successfully! ✅');

      // Update localStorage with new user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        ...response.data,
      }));
      // Merge old and new data
      // ...storedUser = spread old data
      // ...response.data = overwrite with new data

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* NAVBAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Profile
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>

        {/* PROFILE HEADER */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            src={avatar || user?.avatar}
            alt={user?.username}
            sx={{ width: 100, height: 100 }}
          />
          {/* sx={{ width: 100, height: 100 }}: Large avatar */}

          <Box>
            <Typography variant="h4">
              {user?.username}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Member since {new Date(user?.createdAt || '').toLocaleDateString()}
            </Typography>
            {/* toLocaleDateString(): Formats date nicely
                e.g. "3/27/2024" or "27/03/2024" */}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* SUCCESS/ERROR MESSAGES */}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* EDIT PROFILE SECTION */}
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>

        {/* AVATAR URL */}
        <TextField
          fullWidth
          label="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="https://example.com/your-photo.jpg"
          helperText="Paste a link to your profile picture"
        />

        {/* BIO */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Tell other developers about yourself..."
          helperText="Max 500 characters"
          inputProps={{ maxLength: 500 }}
          // inputProps: passes props to the underlying HTML input
          // maxLength: Stops user from typing more than 500 chars
        />

        {/* SKILLS */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Skills
        </Typography>

        {/* Current skills as chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              onDelete={() => handleRemoveSkill(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        {/* Skill input */}
        <TextField
          fullWidth
          label="Add Skill"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ mb: 3 }}
          placeholder="e.g. React, Python, UI Design"
          helperText="Type a skill and press Enter"
        />

        {/* SAVE BUTTON */}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size="large"
          sx={{ mb: 4 }}
        >
          {saving ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>

        <Divider sx={{ mb: 4 }} />

        {/* MY PROJECTS SECTION */}
        <Typography variant="h5" gutterBottom>
          My Projects ({myProjects.length})
        </Typography>

        {myProjects.length === 0 ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              You haven't created any projects yet!
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/create-project')}
            >
              Create Your First Project 🚀
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {myProjects.map((project) => (
              <Box
                key={project._id}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // justifyContent: 'space-between': Push items to sides
                  // Left side: project info
                  // Right side: view button
                }}
                >
                <Box>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {project.description.substring(0, 80)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={project.status} size="small" color="primary" />
                    <Chip
                      label={`${project.members.length} members`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  View
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}