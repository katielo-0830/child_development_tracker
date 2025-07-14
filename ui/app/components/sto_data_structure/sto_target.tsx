import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Target } from "./sto_data_structure";

interface STOTargetProps {
  target: Target;
  location: number[];
  onChange: (updatedTarget: Target) => void;
  onAddTarget: () => void;
  onAddLayer: () => void;
  onDelete: () => void;  // New prop for delete functionality
  isFirst: boolean;  // New prop to determine if this is the first target in a layer
  hasLayer: boolean;
}

export default function STOTarget({ target, location, onChange, onAddTarget, onAddLayer, onDelete, isFirst = true, hasLayer = false }: STOTargetProps) {
  const [localTarget, setLocalTarget] = useState<Target>(target);

  const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTarget = { ...target, target: event.target.value };
    setLocalTarget(updatedTarget);
    onChange?.(updatedTarget);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTarget = { ...localTarget, type: event.target.value as "count" | "response" | null };
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
          sx={{ flexShrink: 0 }}
        >
          <DeleteIcon />
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
      </TextField>
      )}
    </Box>
  );
}

export type { Target, STOTargetProps };