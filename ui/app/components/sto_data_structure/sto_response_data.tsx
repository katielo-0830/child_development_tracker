import React, { useState } from 'react';
import { Box, Typography, Chip, Collapse, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export type ResponseType = '+' | '-' | 'VP' | 'PP' | 'P';

export interface ResponseCounts {
  plus: number;
  minus: number;
  vp: number;
  pp: number;
  p: number;
}

interface STOResponseDataProps {
  label?: string;
  initialCounts?: ResponseCounts;
  onCountChange?: (counts: ResponseCounts, responseSequence: ResponseType[]) => void;
  onRemove?: () => void;
}

const STOResponseData: React.FC<STOResponseDataProps> = ({
  label = 'Response Counter',
  initialCounts = { plus: 0, minus: 0, vp: 0, pp: 0, p: 0 },
  onCountChange,
  onRemove,
}) => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const [counts, setCounts] = useState<ResponseCounts>(initialCounts);
  const [sequence, setSequence] = useState<ResponseType[]>([]);

  const getTypeFromKey = (type: keyof ResponseCounts): ResponseType => {
    switch (type) {
      case 'plus': return '+';
      case 'minus': return '-';
      case 'vp': return 'VP';
      case 'pp': return 'PP';
      case 'p': return 'P';
      default: return '+';
    }
  };

  const handleAddResponse = (type: keyof ResponseCounts) => {
    const responseType = getTypeFromKey(type);
    const newSequence = [...sequence, responseType];
    const newCounts = { ...counts, [type]: (counts[type] || 0) + 1 };
    
    setSequence(newSequence);
    setCounts(newCounts);
    onCountChange?.(newCounts, newSequence);
  };

  const handleRemoveResponse = (index: number) => {
    const responseType = sequence[index];
    const type = Object.entries({
      '+': 'plus',
      '-': 'minus',
      'VP': 'vp',
      'PP': 'pp',
      'P': 'p'
    }).find(([k, _]) => k === responseType)?.[1] as keyof ResponseCounts;
    
    if (!type) return;
    
    const newSequence = sequence.filter((_, i) => i !== index);
    const newCounts = { ...counts, [type]: Math.max(0, (counts[type] || 0) - 1) };
    
    setSequence(newSequence);
    setCounts(newCounts);
    onCountChange?.(newCounts, newSequence);
  };

  const getTypeColor = (type: ResponseType) => ({
    '+': '#4caf50',
    '-': '#f44336',
    'VP': '#2196f3',
    'PP': '#ff9800',
    'P': '#9c27b0'
  }[type] || '#757575');

  const ResponseButton = ({ type, label }: { type: keyof ResponseCounts; label: string }) => {
    const responseType = getTypeFromKey(type);
    const color = getTypeColor(responseType);
    
    return (
      <Box 
        onClick={() => handleAddResponse(type)}
        sx={{
          p: 1.5,
          border: `1px solid ${color}40`,
          borderRadius: 1,
          bgcolor: `${color}10`,
          color: color,
          cursor: 'pointer',
          textAlign: 'center',
          minWidth: 60,
          fontWeight: 'bold',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: `${color}20`,
            transform: 'translateY(-2px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'inherit', mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
            {counts[type]} {counts[type] === 1 ? 'time' : 'times'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: expanded ? 2 : 0,
        }}
      >
        <Box 
          onClick={toggleExpand} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            flexGrow: 1,
            '&:hover': { opacity: 0.8 }
          }}
        >
          <IconButton size="small" sx={{ mr: 1 }}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Typography variant="subtitle1" sx={{ color: '#424242', fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
        {onRemove && (
          <IconButton 
            size="small" 
            onClick={onRemove}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 1.5,
          flexShrink: 0,
          width: 'auto'
        }}>
          <ResponseButton type="plus" label="+" />
          <ResponseButton type="minus" label="-" />
          <ResponseButton type="vp" label="VP" />
          <ResponseButton type="pp" label="PP" />
          <ResponseButton type="p" label="P" />
        </Box>

        {sequence.length > 0 && (
          <Box sx={{ 
            flexGrow: 1,
            borderLeft: '1px solid #eee',
            pl: 3,
            ml: 1
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1.5,
              minHeight: 40,
              alignItems: 'flex-start'
            }}>
              {sequence.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 0.5 }}>
                    Trial {index + 1}
                  </Typography>
                  <Chip
                    label={item}
                    onDelete={() => handleRemoveResponse(index)}
                    deleteIcon={<DeleteOutlineIcon />}
                    sx={{
                      bgcolor: `${getTypeColor(item)}15`,
                      color: getTypeColor(item),
                      border: `1px solid ${getTypeColor(item)}30`,
                      '& .MuiChip-deleteIcon': {
                        color: `${getTypeColor(item)}60`,
                        fontSize: '18px',
                        '&:hover': { 
                          color: getTypeColor(item),
                          bgcolor: 'transparent'
                        }
                      },
                      '&:hover': {
                        bgcolor: `${getTypeColor(item)}20`
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default STOResponseData;
