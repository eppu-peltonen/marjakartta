import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import type { BerryType } from '../types';
import { berryLabels } from '../utils/berryIcons';

interface AddPinDialogProps {
  open: boolean;
  lat: number;
  lng: number;
  onClose: () => void;
  onSubmit: (data: { berryType: BerryType; notes: string }) => void;
  isLoading: boolean;
}

export default function AddPinDialog({
  open,
  lat,
  lng,
  onClose,
  onSubmit,
  isLoading,
}: AddPinDialogProps) {
  const [berryType, setBerryType] = useState<BerryType>('blueberry');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ berryType, notes });
    setNotes('');
    setBerryType('blueberry');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Lisää marjapaikka</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Sijainti: {lat.toFixed(5)}, {lng.toFixed(5)}
            </Box>
            <FormControl fullWidth>
              <InputLabel id="berry-type-label">Marja</InputLabel>
              <Select
                labelId="berry-type-label"
                value={berryType}
                label="Marja"
                onChange={(e) => setBerryType(e.target.value as BerryType)}
              >
                {(Object.keys(berryLabels) as BerryType[]).map((type) => (
                  <MenuItem key={type} value={type}>
                    {berryLabels[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Muistiinpanot"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Esim. runsas satopaikka, helppo pääsy..."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Peruuta
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Tallennetaan...' : 'Tallenna'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
