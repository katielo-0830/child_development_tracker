import React, { useState } from "react";
import { Form, useActionData, redirect } from "react-router";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parse } from 'date-fns';

// Action function to handle form submission
export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const notes = formData.get("notes") as string;

  try {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        startTime,
        endTime,
        notes: notes || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || "Failed to create session");
    }

    const session = await response.json();
    return redirect(`/sessions/${session.id}`);
  } catch (error: any) {
    console.error("Error creating session:", error);
    return { error: error.message || "Failed to create session. Please try again." };
  }
}

export default function CreateSessionPage() {
  const actionData = useActionData() as { error?: string };
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Session
      </Typography>
      
      {actionData?.error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {actionData.error}
        </Typography>
      )}

      <Form method="post">
        <Stack spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="date"
                  required
                  fullWidth
                />
              )}
            />
            
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="startTime"
                  required
                  fullWidth
                />
              )}
            />
            
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="endTime"
                  required
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>

          <TextField
            name="notes"
            label="Notes"
            multiline
            rows={4}
            fullWidth
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Create Session
            </Button>
          </Box>
        </Stack>
      </Form>
    </Container>
  );
}
