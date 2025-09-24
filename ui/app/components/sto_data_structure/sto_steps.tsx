import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Stack, 
  Button,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

interface STOStepsProps {
  value?: string[];
  onChange?: (steps: string[]) => void;
  label?: string;
}

export default function STOSteps({ 
  value = [''], 
  onChange,
  label = 'Steps'
}: STOStepsProps) {
  const [steps, setSteps] = useState<string[]>(value);

  // Update local state when the value prop changes
  useEffect(() => {
    if (value) {
      setSteps(value);
    }
  }, [value]);

  const handleStepChange = (index: number, newValue: string) => {
    const newSteps = [...steps];
    newSteps[index] = newValue;
    setSteps(newSteps);
    onChange?.(newSteps);
  };

  const handleAddStep = () => {
    const newSteps = [...steps, ''];
    setSteps(newSteps);
    onChange?.(newSteps);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return; // Don't remove the last step
    
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    onChange?.(newSteps);
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Stack spacing={2}>
        {steps.map((step, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" sx={{ minWidth: '24px', textAlign: 'center', color: 'text.secondary' }}>
              {index + 1}.
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
            <IconButton
              onClick={() => handleRemoveStep(index)}
              disabled={steps.length <= 1}
              color="error"
              aria-label="remove step"
              sx={{ flexShrink: 0 }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddStep}
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Step
        </Button>
      </Stack>
    </Box>
  );
}
