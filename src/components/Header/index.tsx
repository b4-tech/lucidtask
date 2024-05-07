'use client';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useStore } from '@/store/formulaStore';

const Header = () => {
  const { formulas, addFormula } = useStore();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <FunctionsIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Formula ({formulas.length})
        </Typography>
        <Button variant="contained" color="secondary" onClick={addFormula}>
          Add Formula
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
