import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { BerryPin, BerryType, UpdatePinPayload } from '../types';
import { berryColors, berryLabels } from '../utils/berryIcons';

interface PinDetailsDialogProps {
  pin: BerryPin | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onUpdate: (id: string, data: UpdatePinPayload) => void;
  isUpdating: boolean;
}

export default function PinDetailsDialog({
  pin,
  open,
  onClose,
  onDelete,
  isDeleting,
  onUpdate,
  isUpdating,
}: PinDetailsDialogProps) {
  const [editing, setEditing] = useState(false);
  const [berryType, setBerryType] = useState<BerryType>('blueberry');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (pin) {
      setBerryType(pin.berryType);
      setNotes(pin.notes);
      setEditing(false);
    }
  }, [pin]);

  if (!pin) return null;

  const handleSave = () => {
    onUpdate(pin.id, { berryType, notes });
  };

  const handleCancel = () => {
    setBerryType(pin.berryType);
    setNotes(pin.notes);
    setEditing(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!editing && (
          <Chip
            label={berryLabels[pin.berryType]}
            size="small"
            sx={{
              backgroundColor: berryColors[pin.berryType],
              color: '#fff',
              fontWeight: 600,
            }}
          />
        )}
        {editing && (
          <Box component="span" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Muokkaa marjapaikkaa
          </Box>
        )}
        <Box sx={{ flex: 1 }} />
        {!editing && (
          <IconButton
            aria-label="muokkaa"
            onClick={() => setEditing(true)}
            size="small"
            color="primary"
          >
            <EditIcon />
          </IconButton>
        )}
        <IconButton
          aria-label="poista"
          onClick={() => onDelete(pin.id)}
          disabled={isDeleting}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {editing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="edit-berry-type-label">Marjatyyppi</InputLabel>
              <Select
                labelId="edit-berry-type-label"
                value={berryType}
                label="Marjatyyppi"
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
              fullWidth
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Sijainti: {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
            </Typography>
            {pin.notes && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Muistiinpanot
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {pin.notes}
                </Typography>
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              Lisätty: {new Date(pin.createdAt).toLocaleDateString('fi-FI')}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {editing ? (
          <>
            <Button onClick={handleCancel} disabled={isUpdating}>
              Peruuta
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? 'Tallennetaan...' : 'Tallenna'}
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Sulje</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
