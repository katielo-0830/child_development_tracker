import { Form, useActionData, redirect, useNavigate } from "react-router";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

// Action function to handle form submission
export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    const response = await fetch("/api/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name, 
        description,
        status: 'pending',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Failed to create program");
    }

    // Redirect to the programs list page after successful creation
    return redirect(`/programs`);
  } catch (error) {
    console.error("Error creating program:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to create program. Please try again." 
    };
  }
}

export default function CreateProgramPage() {
  const actionData = useActionData() as { error?: string };
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/programs');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Program
      </Typography>
      
      <Box 
        component={Form} 
        method="post" 
        noValidate
        sx={{ 
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Stack spacing={3}>
          <TextField
            label="Program Name"
            name="name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            helperText="Enter a descriptive name for the program"
          />
          

          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            helperText="Provide a detailed description of the program"
          />
          
          {actionData?.error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {actionData.error}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Create Program
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}