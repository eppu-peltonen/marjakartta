import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { BerryPin, BerryType, UpdatePinPayload } from '../types';
import { berryIcons } from '../utils/berryIcons';
import { usePins, useCreatePin, useDeletePin, useUpdatePin } from '../hooks/usePins';
import BerryFilter from './BerryFilter';
import AddPinDialog from './AddPinDialog';
import PinDetailsDialog from './PinDetailsDialog';

const FINLAND_CENTER: [number, number] = [64.0, 26.0];
const DEFAULT_ZOOM = 6;

function MapClickHandler({ onMapClick }: { onMapClick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

export default function BerryMap() {
  const { data: pins = [], isError } = usePins();
  const createPin = useCreatePin();
  const deletePin = useDeletePin();
  const updatePin = useUpdatePin();

  const [filter, setFilter] = useState<BerryType[]>(['blueberry', 'lingonberry']);
  const [addMode, setAddMode] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPin, setSelectedPin] = useState<BerryPin | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const filteredPins = useMemo(
    () => pins.filter((p) => filter.includes(p.berryType)),
    [pins, filter],
  );

  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (!addMode) return;
      setClickedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      setAddDialogOpen(true);
    },
    [addMode],
  );

  const handleAddSubmit = (data: { berryType: BerryType; notes: string }) => {
    if (!clickedLatLng) return;
    createPin.mutate(
      { lat: clickedLatLng.lat, lng: clickedLatLng.lng, ...data },
      {
        onSuccess: () => {
          setAddDialogOpen(false);
          setAddMode(false);
          setClickedLatLng(null);
          setSnackbar({ message: 'Marjapaikka lisätty!', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ message: 'Tallentaminen epäonnistui', severity: 'error' });
        },
      },
    );
  };

  const handlePinClick = (pin: BerryPin) => {
    setSelectedPin(pin);
    setDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePin.mutate(id, {
      onSuccess: () => {
        setDetailsOpen(false);
        setSelectedPin(null);
        setSnackbar({ message: 'Marjapaikka poistettu', severity: 'success' });
      },
      onError: () => {
        setSnackbar({ message: 'Poistaminen epäonnistui', severity: 'error' });
      },
    });
  };

  const handleUpdate = (id: string, data: UpdatePinPayload) => {
    updatePin.mutate(
      { id, data },
      {
        onSuccess: (updated) => {
          setSelectedPin(updated);
          setSnackbar({ message: 'Marjapaikka päivitetty!', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ message: 'Päivittäminen epäonnistui', severity: 'error' });
        },
      },
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={FINLAND_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {filteredPins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={berryIcons[pin.berryType]}
            eventHandlers={{
              click: () => handlePinClick(pin),
            }}
          />
        ))}
      </MapContainer>

      <BerryFilter onChange={setFilter} />

      <Tooltip title={addMode ? 'Klikkaa karttaa lisätäksesi' : 'Lisää marjapaikka'}>
        <Fab
          color={addMode ? 'secondary' : 'primary'}
          aria-label="lisää marjapaikka"
          onClick={() => setAddMode((prev) => !prev)}
          sx={{
            position: 'absolute',
            bottom: { xs: 24, sm: 32 },
            right: { xs: 24, sm: 32 },
            zIndex: 1000,
          }}
        >
          <AddLocationIcon />
        </Fab>
      </Tooltip>

      {addMode && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 88, sm: 96 },
            right: { xs: 16, sm: 24 },
            zIndex: 1000,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            px: 2,
            py: 0.75,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Klikkaa karttaa lisätäksesi marjapaikan
        </Box>
      )}

      <AddPinDialog
        open={addDialogOpen}
        lat={clickedLatLng?.lat ?? 0}
        lng={clickedLatLng?.lng ?? 0}
        onClose={() => {
          setAddDialogOpen(false);
          setClickedLatLng(null);
        }}
        onSubmit={handleAddSubmit}
        isLoading={createPin.isPending}
      />

      <PinDetailsDialog
        pin={selectedPin}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPin(null);
        }}
        onDelete={handleDelete}
        isDeleting={deletePin.isPending}
        onUpdate={handleUpdate}
        isUpdating={updatePin.isPending}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity ?? 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>

      {isError && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" variant="filled">
            Marjapaikkojen lataaminen epäonnistui
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
