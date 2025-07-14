import React from "react";
import { useNavigate } from "react-router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Define the Program interface
interface Program {
  id: number;
  name: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the STO interface
interface STO {
  id: number;
  name: string;
  status: string;
  description?: string;
  startDate?: string;
  masteredDate?: string;
}

// clientLoader function to fetch a specific program and its STOs
export async function clientLoader({ params }: { params: { program_id: string } }) {
  const { program_id } = params;

  try {
    // Fetch program details
    const programResponse = await fetch(`/api/programs/${program_id}`);
    if (!programResponse.ok) {
      throw new Error("Failed to load program");
    }
    const program: Program = await programResponse.json();

    // Fetch STOs for the program
    const stosResponse = await fetch(`/api/stos?programId=${program_id}`);
    if (!stosResponse.ok) {
      throw new Error("Failed to load STOs");
    }
    const stos: STO[] = await stosResponse.json();

    return { program, stos };
  } catch (error) {
    console.error("Error loading program or STOs:", error);
    throw error;
  }
}

interface ProgramPageProps {
  loaderData: { program: Program; stos: STO[] };
}

export default function ProgramPage({ loaderData }: ProgramPageProps) {
  const { program, stos } = loaderData;
  const navigate = useNavigate();

  const handleCreateSTOClick = () => {
    // Navigate to the Create STO page
    navigate(`/program/${program.id}/stos/new`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {program.name}
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Status:
        </Typography>
        <Typography variant="body1">{program.status}</Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Description:
        </Typography>
        <Typography variant="body1">
          {program.description || "No description provided."}
        </Typography>
      </Box>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" component="h2">
            STOs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateSTOClick}
          >
            Create STO
          </Button>
        </Stack>
        {stos.length === 0 ? (
          <Typography>No STOs found for this program.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Mastered Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stos.map((sto) => (
                  <TableRow key={sto.id}>
                    <TableCell>{sto.id}</TableCell>
                    <TableCell>{sto.name}</TableCell>
                    <TableCell>{sto.status}</TableCell>
                    <TableCell>{sto.description || "-"}</TableCell>
                    <TableCell>{sto.startDate || "-"}</TableCell>
                    <TableCell>{sto.masteredDate || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}