import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router'; // Changed from 'react-router-dom'

export function Dashboard() {
  // Initialize the navigation hook
  const navigate = useNavigate();

  const handleCreateProgramClick = () => {
    // TODO: Implement navigation or action for "Create Program"
    console.log('Create Program button clicked');
    // Navigate to the programs/new route when implemented
    // navigate('/programs/new');
  };

  const handleAddSessionClick = () => {
    // Navigate to the create session page
    navigate('/sessions/new');
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateProgramClick}
          sx={{ minWidth: '180px' }}
        >
          Create Program
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleAddSessionClick}
          sx={{ minWidth: '180px' }}
        >
          Add Session
        </Button>
      </Stack>
    </Container>
  );
}