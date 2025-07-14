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
  Autocomplete
} from "@mui/material";

// Define interfaces for our data models
interface STO {
  id: number;
  name: string;
  description?: string;
  programId: number;
  createdAt: string;
  updatedAt: string;
}

interface Program {
  id: number;
  name: string;
  description?: string;
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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [stos, setStos] = useState<STO[]>([]);
  const [selectedSTO, setSelectedSTO] = useState<STO | null>(null);
  const [loadingSTOs, setLoadingSTOs] = useState(false);
  const [stoError, setStoError] = useState<string | null>(null);
  const [responseCounts, setResponseCounts] = useState<ResponseCounts>({
    plus: 0,
    minus: 0,
    vp: 0,
    pp: 0,
    p: 0
  });

  const handleProgramChange = async (_: React.SyntheticEvent, newValue: Program | null) => {
    setSelectedProgram(newValue);
    setSelectedSTO(null); // Reset selected STO when program changes
    
    if (!newValue) {
      setStos([]);
      return;
    }

    // Fetch STOs for the selected program
    setLoadingSTOs(true);
    setStoError(null);
    try {
      const response = await fetch(`/api/stos?programId=${newValue.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch STOs');
      }
      const data = await response.json();
      setStos(data);
    } catch (err) {
      console.error('Error fetching STOs:', err);
      setStoError(err instanceof Error ? err.message : 'Failed to load STOs');
    } finally {
      setLoadingSTOs(false);
    }
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
            Session Details
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -2 }}>
          <GridItem>
            <Typography variant="subtitle1" color="textSecondary">Date</Typography>
            <Typography variant="body1" paragraph>{formattedDate}</Typography>
          </GridItem>

          <GridItem>
            <Typography variant="subtitle1" color="textSecondary">Time</Typography>
            <Typography variant="body1" paragraph>
              {formattedStartTime} - {formattedEndTime} ({durationInHours} hours)
            </Typography>
            {session.therapists?.length > 0 && (
              <>
                <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 2 }}>Therapists</Typography>
                <Typography variant="body1">
                  {session.therapists.map(t => t.name).join(', ')}
                </Typography>
              </>
            )}
          </GridItem>
          
          {session.notes && (
            <NotesContainer>
              <Typography variant="subtitle1" color="textSecondary">Notes</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {session.notes}
              </Typography>
            </NotesContainer>
          )}
        </Box>

        {/* Program Selection */}
        <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Enter data for program
          </Typography>
          <Autocomplete
            options={programs}
            getOptionLabel={(option: Program) => option.name}
            value={selectedProgram}
            onChange={handleProgramChange}
            noOptionsText="No programs found"
            isOptionEqualToValue={(option: Program, value: Program) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a program"
                variant="outlined"
                placeholder="Search programs..."
              />
            )}
            fullWidth
          />
          
          {selectedProgram && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select a STO
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={stos}
                  getOptionLabel={(option: STO) => option.name}
                  value={selectedSTO}
                  onChange={(_: React.SyntheticEvent, newValue: STO | null) => setSelectedSTO(newValue)}
                  loading={loadingSTOs}
                  loadingText="Loading STOs..."
                  noOptionsText={loadingSTOs ? 'Loading...' : 'No STOs found for this program'}
                  isOptionEqualToValue={(option: STO, value: STO) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a STO"
                      variant="outlined"
                      placeholder="Search STOs..."
                      error={!!stoError}
                      helperText={stoError}
                    />
                  )}
                  fullWidth
                />
              </Box>
              
              {selectedSTO && (
                <Box sx={{ mt: 3 }}>
                  <STOResponseData 
                    label={`${selectedSTO.name} Responses`}
                    initialCounts={responseCounts}
                    onCountChange={setResponseCounts}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>

        
    </Container>
  );
}
