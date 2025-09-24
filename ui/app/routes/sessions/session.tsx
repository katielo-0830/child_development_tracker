import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { format } from 'date-fns';
import STOResponseData from '~/components/sto_data_structure/sto_response_data';
import type { ResponseCounts } from '~/components/sto_data_structure/sto_response_data';
import { 
  Container, 
  Typography, 
  Box, 
  Divider,
  styled,
  TextField,
  Autocomplete,
  Button,
  MenuItem
} from "@mui/material";
import SessionProgram from './SessionProgram';

// Define interfaces for our data models
interface STO {
  id: number;
  name: string;
  description?: string;
  programId: number;
  createdAt: string;
  updatedAt: string;
}

interface STO {
  id: number;
  name: string;
  description?: string;
  status: 'in_progress' | 'mastered' | 'pending';
  startDate?: string;
  masteredDate?: string;
  programId: number;
  createdAt: string;
  updatedAt: string;
}

interface Program {
  id: number;
  name: string;
  description?: string;
  status: 'running' | 'pending' | 'done';
  stos?: STO[];
  createdAt: string;
  updatedAt: string;
}

export interface Therapist {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  therapists: Therapist[];
}

// Create styled components for the grid items
const GridItem = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    width: '50%',
  },
  width: '100%',
}));

const NotesContainer = styled('div')({
  width: '100%',
  padding: '16px',
});

// Define the Session interface based on the API response
export interface Therapist {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  therapists: Therapist[];
}

// Loader function to fetch session and programs data
export async function clientLoader({ params }: { params: { id: string } }) {
  // Fetch session and programs in parallel
  const [sessionResponse, programsResponse] = await Promise.all([
    fetch(`/api/sessions/${params.id}`),
    fetch('/api/programs')
  ]);

  if (!sessionResponse.ok) {
    throw new Error("Failed to load session");
  }
  
  if (!programsResponse.ok) {
    throw new Error("Failed to load programs");
  }

  const [session, programs] = await Promise.all([
    sessionResponse.json(),
    programsResponse.json()
  ]);

  return { session, programs };
}

export default function SessionPage() {
  const { session, programs } = useLoaderData() as { session: Session; programs: Program[] };
  const [programsInSession, setProgramsInSession] = useState<Program[]>([]);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  
  // Initialize programs from loader
  useEffect(() => {
    if (programs) {
      setAllPrograms(programs);
    }
  }, [programs]);

  const handleProgramChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const programId = Number(event.target.value);
    setSelectedProgramId(programId);
  };

  const handleAddProgram = () => {
    if (selectedProgramId) {
      const programToAdd = allPrograms.find(p => p.id === selectedProgramId);
      if (programToAdd && !programsInSession.some(p => p.id === programToAdd.id)) {
        setProgramsInSession([...programsInSession, programToAdd]);
      }
      setSelectedProgramId(null);
    }
  };

  const handleRemoveProgram = (programId: number) => {
    setProgramsInSession(programsInSession.filter(p => p.id !== programId));
  };

  const handleUpdateSTOData = (programId: number, stoId: number, data: any) => {
    // In a real app, you would save this data to your backend
    console.log(`Updating STO ${stoId} in program ${programId}:`, data);
  };
  
  // Format date and times for display
  const formatTimeString = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formattedDate = format(new Date(session.date), 'MMMM d, yyyy');
  const startTime = formatTimeString(session.date, session.startTime);
  const endTime = formatTimeString(session.date, session.endTime);
  const formattedStartTime = format(startTime, 'h:mm a');
  const formattedEndTime = format(endTime, 'h:mm a');
  const durationInHours = (
    (endTime.getTime() - startTime.getTime()) / 
    (1000 * 60 * 60)
  ).toFixed(1);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Session - {format(new Date(session.date), 'EEEE, MMMM d, yyyy')} • {formattedStartTime}-{formattedEndTime} • {session.therapists?.map(t => t.name).join(', ')}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -2 }}>
          
          {session.notes && (
            <NotesContainer>
              <Typography variant="subtitle1" color="textSecondary">Notes</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {session.notes}
              </Typography>
            </NotesContainer>
          )}
        </Box>

        {/* Programs in Session */}
        <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
          <Box display="flex" gap={2} sx={{ mb: 2}}>
            <Box flexGrow={1}>
              <TextField
                fullWidth
                select
                size="small"
                label="Select Program"
                value={selectedProgramId || ''}
                onChange={handleProgramChange}
                disabled={allPrograms.length === 0 || allPrograms.every(p => programsInSession.some(added => added.id === p.id))}
              >
                <MenuItem value="" disabled>
                  {allPrograms.every(p => programsInSession.some(added => added.id === p.id))
                    ? 'All programs added' 
                    : 'Select a program'}
                </MenuItem>
                {allPrograms
                  .filter(program => !programsInSession.some(p => p.id === program.id))
                  .map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProgram}
              disabled={!selectedProgramId || allPrograms.every(p => programsInSession.some(added => added.id === p.id))}
            >
              Add
            </Button>
          </Box>

          {programsInSession.length === 0 ? (
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2, mb: 4, fontStyle: 'italic' }}>
              Select a program from the dropdown to add it to this session.
            </Typography>
          ) : (
            <Box sx={{ '& > *': { mb: 2 } }}>
              {programsInSession.map((program) => (
                <SessionProgram
                  key={program.id}
                  program={program}
                  onRemoveProgram={handleRemoveProgram}
                  onUpdateSTOData={handleUpdateSTOData}
                />
              ))}
            </Box>
          )}
        </Box>
    </Container>
  );
}
