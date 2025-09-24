import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import STOSteps from "./sto_steps";
import { type Target } from "./sto_data_structure";

interface STOTargetProps {
  target: Target;
  location: number[];
  onChange: (updatedTarget: Target) => void;
  onAddTarget: () => void;
  onAddLayer: () => void;
  onDelete: () => void;
  isFirst: boolean;
  hasLayer: boolean;
  canDelete: boolean;
}

export default function STOTarget({ target, location, onChange, onAddTarget, onAddLayer, onDelete, isFirst = true, hasLayer = false, canDelete = true }: STOTargetProps) {
  const [localTarget, setLocalTarget] = useState<Target>(target);
  const [steps, setSteps] = useState<string[]>([]);

  // Initialize steps from target data if it exists
  useEffect(() => {
    if (target.steps) {
      setSteps(target.steps);
    } else {
      setSteps(['']);
    }
  }, [target.steps]);

  const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTarget = { ...target, target: event.target.value };
    setLocalTarget(updatedTarget);
    onChange?.(updatedTarget);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as "count" | "response" | "steps" | null;
    const updatedTarget = { ...localTarget, type: newType };
    
    // Clear steps data if type is changed from 'steps' to something else
    if (localTarget.type === 'steps' && newType !== 'steps') {
      const { steps: _, ...targetWithoutSteps } = updatedTarget;
      setLocalTarget(targetWithoutSteps as Target);
      onChange?.(targetWithoutSteps as Target);
    } else {
      setLocalTarget(updatedTarget);
      onChange?.(updatedTarget);
    }
  };

  const handleStepsChange = (newSteps: string[]) => {
    const updatedTarget = { ...localTarget, steps: newSteps };
    setLocalTarget(updatedTarget);
    onChange?.(updatedTarget);
  };

  return (
    <Box sx={{ml: (location.length-1) * 2, pl: location.length > 1 ? 2 : 0 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Target"
          value={localTarget.target}
          variant="outlined"
          onChange={handleTargetChange}
          fullWidth
        />
        {isFirst && (
          <Button
            variant="outlined"
            onClick={onAddTarget}
            sx={{ minWidth: "120px" }}
          >
            + target
          </Button>
        )}
        {!hasLayer && (
          <Button
            variant="outlined"
            onClick={onAddLayer}
            sx={{ minWidth: "120px" }}
          >
            + layer
          </Button>
        )}
        <IconButton
          onClick={onDelete}
          color="error"
          aria-label="delete target"
          disabled={!canDelete}
          sx={{ 
            flexShrink: 0,
            opacity: canDelete ? 1 : 0.5,
            '&:hover': {
              backgroundColor: canDelete ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
            }
          }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
      { !hasLayer && (
      <TextField
        select
        label="Type"
        value={localTarget.type || ""}
        variant="outlined"
        onChange={handleTypeChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="count">Count</MenuItem>
        <MenuItem value="response">Response</MenuItem>
        <MenuItem value="steps">Steps</MenuItem>
      </TextField>
      )}
      {!hasLayer && localTarget.type === 'steps' && (
        <Box sx={{ mb: 2 }}>
          <STOSteps 
            value={steps} 
            onChange={handleStepsChange} 
            label={localTarget.target ? `${localTarget.target} Steps` : 'Steps'}
          />
        </Box>
      )}
    </Box>
  );
}

export type { Target, STOTargetProps };