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

// Define the Session interface
interface Session {
  id: number;
  name: string;
  status: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Loader function to fetch sessions data
export async function clientLoader() {
  const response = await fetch("/api/sessions");
  if (!response.ok) {
    throw new Error("Failed to load sessions");
  }
  return response.json();
}

export default function SessionsPage() {
  const sessions = useLoaderData() as Session[];
  const navigate = useNavigate();

  const handleCreateSessionClick = () => {
    // Navigate to the Create Session page
    navigate("/sessions/new");
  };

  const handleViewClick = (sessionId: number) => {
    // Navigate to the specific session details page
    navigate(`/sessions/${sessionId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sessions
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
          onClick={handleCreateSessionClick}
        >
          Create Session
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.id}</TableCell>
                <TableCell>{session.name}</TableCell>
                <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                <TableCell>{session.status}</TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {session.notes ? 
                      (session.notes.length > 30 ? `${session.notes.substring(0, 30)}...` : session.notes) 
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewClick(session.id)}
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
