import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import { projectService } from '../services/projectService';

export default function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  const [techStack, setTechStack] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  // Example: techStack = ["React", "Node.js", "MongoDB"]

  const [techInput, setTechInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  // These are TEMPORARY inputs
  // User types "React", presses Enter, "React" added to techStack array
  // Then techInput is cleared

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      // [...techStack, newItem] = spread old array + add new item
      setTechInput(''); // Clear input after adding
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
    // filter() keeps items that DON'T match
    // Example: Remove "React" from ["React", "Node.js"]
    // filter((t) => t !== "React") -> ["Node.js"]
  };

  // ADD ROLE TO ARRAY
  const handleAddRole = () => {
    if (roleInput.trim() && !lookingFor.includes(roleInput.trim())) {
      setLookingFor([...lookingFor, roleInput.trim()]);
      setRoleInput('');
    }
  };

  // REMOVE ROLE FROM ARRAY
  const handleRemoveRole = (role: string) => {
    setLookingFor(lookingFor.filter((r) => r !== role));
  };

  // HANDLE ENTER KEY PRESS
  const handleKeyPress = (
    e: React.KeyboardEvent,
    addFunction: () => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addFunction();
    }
    // User presses Enter in tech input -> calls handleAddTech
    // User presses Enter in role input -> calls handleAddRole
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !description || techStack.length === 0) {
      setError('Name, description, and at least one tech stack item are required');
      return;
    }

    setLoading(true);

    try {
      await projectService.createProject({
        name,
        description,
        techStack,
        lookingFor,
        repositoryUrl: repositoryUrl || undefined,
        liveUrl: liveUrl || undefined,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* NAVBAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Create New Project
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Project 🚀
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>

          {/* PROJECT NAME */}
          <TextField
            fullWidth
            required
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Give your project a clear, descriptive name"
          />

          {/* DESCRIPTION */}
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Describe what your project does and what you're building"
          />
          {/* multiline + rows={4}: Makes it a textarea instead of single line */}

          {/* TECH STACK */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Tech Stack * (press Enter to add)
          </Typography>

          {/* Show added techs as chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {techStack.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                onDelete={() => handleRemoveTech(tech)}
                color="primary"
                variant="outlined"
              />
              // Chip: Tag-like UI component
              // label: Text shown on chip
              // onDelete: Shows X button, calls handleRemoveTech
              // Example chip: [React ×]
            ))}
          </Box>

          {/* Tech input */}
          <TextField
            fullWidth
            label="Add Technology"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAddTech)}
            sx={{ mb: 2 }}
            placeholder="e.g. React, Node.js, MongoDB"
            helperText="Type a technology and press Enter"
          />

          {/* LOOKING FOR */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Looking For (press Enter to add)
          </Typography>

          {/* Show added roles as chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {lookingFor.map((role) => (
              <Chip
                key={role}
                label={role}
                onDelete={() => handleRemoveRole(role)}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>

          {/* Role input */}
          <TextField
            fullWidth
            label="Add Role"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAddRole)}
            sx={{ mb: 2 }}
            placeholder="e.g. Frontend Developer, UI/UX Designer"
            helperText="Type a role and press Enter"
          />

          {/* OPTIONAL FIELDS */}
          <TextField
            fullWidth
            label="GitHub Repository URL (optional)"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="https://github.com/username/repo"
          />

          <TextField
            fullWidth
            label="Live URL (optional)"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="https://yourproject.com"
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Creating Project...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}