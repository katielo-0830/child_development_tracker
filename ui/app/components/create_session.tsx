import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Checkbox,
  Container, 
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid, 
  TextField,
  Typography,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

// Define TypeScript interfaces
interface Therapist {
  id: number;
  name: string;
}

interface FormData {
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  therapistIds: number[];
  notes: string;
}

interface FormErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  therapistIds?: string;
}

export function CreateSession() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    date: null,
    startTime: null,
    endTime: null,
    therapistIds: [],
    notes: ''
  });
  
  // Form errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch therapists when component mounts
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch('/api/therapists');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch therapists: ${response.status}`);
        }
        
        const data = await response.json();
        setTherapists(data);
      } catch (error) {
        console.error('Error fetching therapists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Handle therapist checkbox changes
  const handleTherapistChange = (therapistId: number) => {
    setFormData(prevState => {
      const currentIds = [...prevState.therapistIds];
      
      if (currentIds.includes(therapistId)) {
        // Remove if already selected
        return {
          ...prevState,
          therapistIds: currentIds.filter(id => id !== therapistId)
        };
      } else {
        // Add if not selected
        return {
          ...prevState,
          therapistIds: [...currentIds, therapistId]
        };
      }
    });
    
    // Clear error once at least one therapist is selected
    if (errors.therapistIds) {
      setErrors(prev => ({ ...prev, therapistIds: undefined }));
    }
  };

  // Handle notes field change
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({
      ...prevState,
      notes: event.target.value
    }));
  };

  // Validate form data before submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime && 
               formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (formData.therapistIds.length === 0) {
      newErrors.therapistIds = 'At least one therapist must be selected';
    }
    
    setErrors(newErrors);
    
    // Form is valid if errors object is empty
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Reset submission states
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form data
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for the API
      const submissionData = {
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : '',
        startTime: formData.startTime ? format(formData.startTime, 'HH:mm:ss') : '',
        endTime: formData.endTime ? format(formData.endTime, 'HH:mm:ss') : '',
        therapistIds: formData.therapistIds,
        notes: formData.notes
      };
      
      // Make API request
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create session');
      }
      
      // Success!
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        date: null,
        startTime: null,
        endTime: null,
        therapistIds: [],
        notes: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardHeader 
            title="Create New Session" 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              textAlign: 'center'
            }} 
          />
          <CardContent>
            {isLoading ? (
              <Typography>Loading therapists data...</Typography>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  {/* Date Picker */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <DatePicker
                      label="Session Date *"
                      value={formData.date}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, date: newValue }));
                        if (errors.date) {
                          setErrors(prev => ({ ...prev, date: undefined }));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Start Time Picker */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TimePicker 
                      label="Start Time *"
                      value={formData.startTime}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, startTime: newValue }));
                        if (errors.startTime) {
                          setErrors(prev => ({ ...prev, startTime: undefined }));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startTime,
                          helperText: errors.startTime,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* End Time Picker */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TimePicker 
                      label="End Time *"
                      value={formData.endTime}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, endTime: newValue }));
                        if (errors.endTime) {
                          setErrors(prev => ({ ...prev, endTime: undefined }));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endTime,
                          helperText: errors.endTime,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Notes Field */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Notes"
                      multiline
                      rows={3}
                      fullWidth
                      value={formData.notes}
                      onChange={handleNotesChange}
                    />
                  </Grid>
                  
                  {/* Therapists Selection */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Select Therapists *
                    </Typography>
                    <FormControl 
                      component="fieldset" 
                      error={!!errors.therapistIds}
                      sx={{ width: '100%' }}
                    >
                      <FormGroup>
                        <Grid container spacing={2}>
                          {therapists.length === 0 ? (
                            <Grid size={{ xs: 12 }}>
                              <Typography color="text.secondary">
                                No therapists available. Please add therapists first.
                              </Typography>
                            </Grid>
                          ) : (
                            therapists.map((therapist) => (
                              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={therapist.id}>
                                <FormControlLabel
                                  control={
                                    <Checkbox 
                                      checked={formData.therapistIds.includes(therapist.id)}
                                      onChange={() => handleTherapistChange(therapist.id)}
                                    />
                                  }
                                  label={therapist.name}
                                />
                              </Grid>
                            ))
                          )}
                        </Grid>
                      </FormGroup>
                      {errors.therapistIds && (
                        <FormHelperText>{errors.therapistIds}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  {/* Submit Button & Status Messages */}
                  <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', mt: 2 }}>
                    {submitSuccess && (
                      <Typography 
                        color="success.main" 
                        sx={{ mb: 2 }}
                      >
                        Session created successfully!
                      </Typography>
                    )}
                    
                    {submitError && (
                      <Typography 
                        color="error" 
                        sx={{ mb: 2 }}
                      >
                        Error: {submitError}
                      </Typography>
                    )}
                    
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting || therapists.length === 0}
                      sx={{ px: 5 }}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Session'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
}