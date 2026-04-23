import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ForestIcon from '@mui/icons-material/Forest';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useAuth } from '../hooks/useAuth';

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <ForestIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Marjakartta
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.username}
            </Typography>
            <Tooltip title="Kirjaudu ulos">
              <IconButton color="inherit" onClick={logout} aria-label="kirjaudu ulos">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
