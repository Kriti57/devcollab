import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Select,           
  FormControl,     
  InputLabel,       
  IconButton,
} from '@mui/material';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import type { Project, User } from '../types';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  // Check if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await authService.getCurrentUser();
        setUser(userResponse.data);
        const projectsResponse = await projectService.getAllProjects();
        setProjects(projectsResponse.data);
      } catch (err: any) {
        // If token expired, redirect to login
        if (err.response?.status === 401) {
          authService.logout();
          navigate('/login');
        }
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter projects by search term
  const filteredProjects = projects.filter((project) => {
  // Search filter
  const matchesSearch =
    searchTerm === '' ||
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.techStack.some((tech) =>
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Status filter
  const matchesStatus =
    statusFilter === '' ||
    project.status === statusFilter;
  // Empty = show all, otherwise exact match

  // Tech stack filter
  const matchesTech =
    techFilter === '' ||
    project.techStack.some((tech) =>
      tech.toLowerCase().includes(techFilter.toLowerCase())
    );
  // Check if ANY tech in project matches filter

  // Role filter
  const matchesRole =
    roleFilter === '' ||
    project.lookingFor.some((role) =>
      role.toLowerCase().includes(roleFilter.toLowerCase())
    );
  // Check if ANY role in project matches filter

  // Project must match ALL active filters
  return matchesSearch && matchesStatus && matchesTech && matchesRole;
});

// Count active filters for UI feedback
const activeFiltersCount = [statusFilter, techFilter, roleFilter]
  .filter(Boolean).length;
// .filter(Boolean): Remove empty strings
// .length: Count how many filters are active
// Example: statusFilter="active", techFilter="", roleFilter="Designer"
// ["active", "", "Designer"].filter(Boolean) = ["active", "Designer"]
// .length = 2 active filters

const clearFilters = () => {
  setStatusFilter('');
  setTechFilter('');
  setRoleFilter('');
  setSearchTerm('');
  // Reset all filters to empty = show all projects
};

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'default';
      case 'on-hold': return 'warning';
      default: return 'primary';
    }
  };
  // ↑ Helper function to get correct color for status
  // Keeps JSX cleaner (don't repeat this logic multiple times)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* minHeight: Fill full screen height */}
      {/* bgcolor: Light gray background */}

      {/* NAVBAR */}
      <AppBar position="static" elevation={0}>
        {/* elevation={0}: Remove shadow under navbar */}
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🚀 DevCollab
          </Typography>

          <Button
            color="inherit"
            onClick={() => navigate('/create-project')}
            sx={{ mr: 2 }}
          >
            + New Project
          </Button>
          {/* Quick access to create project from navbar */}

          <Button color="inherit" onClick={handleMenuOpen}>
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            {/* Small avatar showing first letter of username */}
            {/* charAt(0).toUpperCase(): Gets first letter, makes uppercase */}
            {/* Example: "kriti" → "K" */}
            {user?.username}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}>
              👤 My Profile
            </MenuItem>
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate('/create-project');
            }}>
              ➕ Create Project
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              🚪 Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* WELCOME SECTION */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome back, {user?.username}! 👋
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Discover projects and collaborate with developers
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/create-project')}
            sx={{ display: { xs: 'none', sm: 'block' } }}
            // Hide on mobile (xs), show on small+ screens
          >
            + Create Project
          </Button>
        </Box>

        {/* STATS ROW */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Card sx={{ flex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {projects.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Projects
            </Typography>
          </Card>
          <Card sx={{ flex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {projects.filter(p => p.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Active Projects
            </Typography>
          </Card>
          <Card sx={{ flex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="secondary.main">
              {projects.filter(p =>
                p.members.some((m: any) => m._id === user?._id)
              ).length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Joined Projects
            </Typography>
          </Card>
        </Box>
        {/* Stats row shows quick overview numbers */}

        {/* SEARCH AND FILTERS */}
        <Box sx={{ mb: 3 }}>

          {/* SEARCH BAR */}
          <TextField
            fullWidth
            placeholder="🔍 Search by name, description, or tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
          />

          {/* FILTER ROW */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

            {/* STATUS FILTER DROPDOWN */}
            <FormControl sx={{ minWidth: 150, bgcolor: 'white' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
              </Select>
            </FormControl>
            {/* FormControl: Wrapper for Select with label */}
            {/* Select: Dropdown menu */}
            {/* MenuItem value="": Empty = show all */}

            {/* TECH STACK FILTER */}
            <TextField
              placeholder="Filter by tech..."
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              sx={{ minWidth: 150, bgcolor: 'white' }}
            />
            {/* Simple text input - filters as you type! */}

            {/* ROLE FILTER */}
            <TextField
              placeholder="Filter by role..."
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 150, bgcolor: 'white' }}
            />
            {/* Example: type "Designer" → shows projects looking for designers */}

            {/* CLEAR FILTERS BUTTON */}
            {activeFiltersCount > 0 && (
              // Only show clear button if filters are active!
              <Button
                variant="outlined"
                color="error"
                onClick={clearFilters}
                size="small"
              >
                Clear Filters ({activeFiltersCount})
              </Button>
              // Shows how many filters are active
              // Example: "Clear Filters (2)"
            )}
          </Box>

          {/* ACTIVE FILTER CHIPS */}
          {activeFiltersCount > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {/* Show active filters as removable chips */}

              {statusFilter && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  onDelete={() => setStatusFilter('')}
                  size="small"
                  color="primary"
                />
                // onDelete: X button removes this filter
              )}
              {techFilter && (
                <Chip
                  label={`Tech: ${techFilter}`}
                  onDelete={() => setTechFilter('')}
                  size="small"
                  color="primary"
                />
              )}
              {roleFilter && (
                <Chip
                  label={`Role: ${roleFilter}`}
                  onDelete={() => setRoleFilter('')}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          )}
          {/* Visual feedback: "Status: active × " "Tech: React × " */}
        </Box>

        {/* ERROR */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* LOADING */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {activeFiltersCount > 0 || searchTerm
                ? 'Filtered Projects'
                : 'All Projects'}
              {' '}
              <Typography component="span" color="textSecondary">
                ({filteredProjects.length} of {projects.length})
              </Typography>
            </Typography>
            {/* Show "Results for X" when searching, otherwise "All Projects" */}

            {filteredProjects.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {searchTerm ? 'No projects match your search' : 'No projects yet!'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/create-project')}
                  sx={{ mt: 2 }}
                >
                  Create the First Project 🚀
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {filteredProjects.map((project) => (
                  <Box
                    key={project._id}
                    sx={{
                      width: {
                        xs: '100%',
                        sm: 'calc(50% - 12px)',
                        md: 'calc(33.333% - 16px)',
                      },
                    }}
                  >
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      // transition: Smooth animation effect
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        // On hover: Card lifts up slightly
                        // translateY(-4px): Move 4px up
                        // boxShadow: 4: Add shadow
                      },
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>

                        {/* Project name + status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {project.name}
                          </Typography>
                          <Chip
                            label={project.status}
                            size="small"
                            color={getStatusColor(project.status) as any}
                          />
                        </Box>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 2 }}
                        >
                          {project.description.substring(0, 100)}
                          {project.description.length > 100 ? '...' : ''}
                          {/* Only add '...' if description was cut off */}
                        </Typography>

                        {/* Tech stack chips */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {project.techStack.slice(0, 3).map((tech) => (
                            // .slice(0, 3): Show only first 3 techs
                            // Prevents too many chips on small cards
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {project.techStack.length > 3 && (
                            <Chip
                              label={`+${project.techStack.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                            // Show "+2" if there are more than 3 techs
                          )}
                        </Box>

                        {/* Creator & members */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={project.creator.avatar}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            by {project.creator.username} • {project.members.length} members
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/projects/${project._id}`)}
                          fullWidth
                        >
                          View Project
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}