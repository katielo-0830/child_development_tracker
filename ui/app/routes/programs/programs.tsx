import React from "react";
import { useLoaderData } from "react-router";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router";

// Define the Program interface
interface Program {
  id: number;
  name: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Loader function to fetch programs data
export async function clientLoader() {
  const response = await fetch("/api/programs");
  if (!response.ok) {
    throw new Error("Failed to load programs");
  }
  return response.json();
}

export default function ProgramsPage() {
  const programs = useLoaderData() as Program[];
  const navigate = useNavigate();

  const handleCreateProgramClick = () => {
    // Navigate to the Create Program page
    navigate("/programs/new");
  };

  const handleEditClick = (programId: number) => {
    // Navigate to the specific program page
    navigate(`/program/${programId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Programs
      </Typography>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateProgramClick}
        >
          Create Program
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>{program.id}</TableCell>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.status}</TableCell>
                <TableCell>{program.description || "-"}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(program.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}