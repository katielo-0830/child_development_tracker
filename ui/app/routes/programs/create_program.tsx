import React from "react";
import { Form, useActionData, redirect, useParams } from "react-router";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

// Action function to handle form submission
export async function clientAction({ request, params }: { request: Request; params: { program_id: string } }) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const { program_id } = params;

  try {
    const response = await fetch("/api/stos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name, 
        description, 
        status: "pending",
        programId: parseInt(program_id, 10)
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create STO");
    }

    // Redirect to the program page after successful creation
    return redirect(`/program/${program_id}`);
  } catch (error) {
    console.error("Error creating STO:", error);
    return { error: "Failed to create STO. Please try again." };
  }
}

export default function CreateSTOPage() {
  const actionData = useActionData();
  const { program_id } = useParams();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create STO
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Program ID: {program_id}
      </Typography>
      <Box component={Form} method="post" noValidate>
        <Stack spacing={3}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
          />
          {actionData?.error && (
            <Typography color="error">{actionData.error}</Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create STO
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}