import { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import type { BerryType } from '../types';
import { berryColors, berryLabels } from '../utils/berryIcons';

interface BerryFilterProps {
  onChange: (selected: BerryType[]) => void;
}

export default function BerryFilter({ onChange }: BerryFilterProps) {
  const [selected, setSelected] = useState<BerryType[]>(['blueberry', 'lingonberry']);

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: BerryType[]) => {
    if (value.length === 0) return;
    setSelected(value);
    onChange(value);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        p: 1.5,
        borderRadius: 3,
      }}
    >
      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
        Suodata marjat
      </Typography>
      <ToggleButtonGroup
        value={selected}
        onChange={handleChange}
        size="small"
        aria-label="berry filter"
      >
        {(Object.keys(berryLabels) as BerryType[]).map((type) => (
          <ToggleButton key={type} value={type} aria-label={berryLabels[type]}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: berryColors[type],
                mr: 0.75,
              }}
            />
            {berryLabels[type]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
}
