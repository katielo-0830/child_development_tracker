import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse, Button, MenuItem, TextField, Paper } from '@mui/material';
import { ExpandMore, ExpandLess, DeleteOutline } from '@mui/icons-material';
import STOResponseData from '~/components/sto_data_structure/sto_response_data';

interface STO {
  id: number;
  name: string;
  description?: string;
  status: 'in_progress' | 'mastered' | 'pending';
  startDate?: string;
  masteredDate?: string;
}

interface Program {
  id: number;
  name: string;
  description?: string;
  status: 'running' | 'pending' | 'done';
  stos?: STO[];
}

interface SessionProgramProps {
  program: Program;
  onRemoveProgram: (programId: number) => void;
  onUpdateSTOData: (programId: number, stoId: number, data: any) => void;
}

const SessionProgram: React.FC<SessionProgramProps> = ({
  program,
  onRemoveProgram,
  onUpdateSTOData,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedSTOs, setSelectedSTOs] = useState<number[]>([]);
  const [stos, setStos] = useState<STO[]>(program.stos || []);
  const [showSTOSelect, setShowSTOSelect] = useState(false);
  const [currentSTO, setCurrentSTO] = useState<number | null>(null);

  useEffect(() => {
    // Fetch STOs for this program if not already loaded
    const fetchSTOs = async () => {
      try {
        const response = await fetch(`/api/programs/${program.id}/stos`);
        if (response.ok) {
          const data = await response.json();
          setStos(data);
        }
      } catch (error) {
        console.error('Error fetching STOs:', error);
      }
    };

    if (!program.stos || program.stos.length === 0) {
      fetchSTOs();
    }
  }, [program.id, program.stos]);

  const handleSTOChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value;
    const stoId = value === '' ? null : Number(value);
    
    if (stoId && !selectedSTOs.includes(stoId)) {
      setSelectedSTOs([...selectedSTOs, stoId]);
      setCurrentSTO(stoId);
    }
    
    setShowSTOSelect(false);
  };

  const handleAddSTOData = () => {
    setShowSTOSelect(true);
    setCurrentSTO(null);
  };

  const handleRemoveSTO = (stoId: number) => {
    setSelectedSTOs(selectedSTOs.filter(id => id !== stoId));
    if (currentSTO === stoId) {
      const newCurrentSTO = selectedSTOs.length > 0 ? selectedSTOs[0] : null;
      setCurrentSTO(newCurrentSTO);
    }
  };

  const handleResponseDataChange = (counts: any, responseSequence: any[], stoId: number) => {
    onUpdateSTOData(program.id, stoId, { counts, responseSequence, lastUpdated: new Date().toISOString() });
  };

  const selectedSTOData = stos.find(sto => sto.id === currentSTO);

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{ mr: 1 }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Typography variant="h6">{program.name}</Typography>
        </Box>
        <IconButton 
          onClick={() => onRemoveProgram(program.id)}
          size="small"
          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
        >
          <DeleteOutline />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {!showSTOSelect ? (
            <Button
              variant="outlined"
              onClick={handleAddSTOData}
              sx={{ mb: 2 }}
            >
              Add data for a STO
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select STO"
                value={currentSTO ?? ''}
                onChange={handleSTOChange}
                sx={{ minWidth: 200 }}
              >
                {stos
                  .filter(sto => !selectedSTOs.includes(sto.id))
                  .map((sto) => (
                    <MenuItem key={sto.id} value={sto.id}>
                      {sto.name}
                    </MenuItem>
                  ))}
              </TextField>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowSTOSelect(false)}
              >
                Cancel
              </Button>
            </Box>
          )}

          {selectedSTOs.map(stoId => {
            const stoData = stos.find(s => s.id === stoId);
            return stoData ? (
              <Box key={stoId} sx={{ mb: 3 }}>
                <STOResponseData
                  label={stoData.name}
                  onCountChange={(counts, sequence) => handleResponseDataChange(counts, sequence, stoId)}
                  onRemove={() => handleRemoveSTO(stoId)}
                />
              </Box>
            ) : null;
          })}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SessionProgram;
