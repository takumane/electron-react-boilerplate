import { render } from 'react-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import shadows, { Shadows } from '@mui/material/styles/shadows';

import App from './app/index';

import './reset.css';
import './index.sass';
import { HashRouter, Routes } from 'react-router-dom';

const theme = createTheme({
    shadows: shadows.map(() => 'none') as Shadows,
    typography: {
        fontFamily: [
            '"Poppins"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    components: {
        
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    textTransform: 'none',
                    fontWeight: 500,
                },
            }, 
        }, 
    },
    palette: {
        primary: {
            main: '#de3d4f'
        },
        secondary: {
            main: '#008475'
        },
    }
});

render(
    <ThemeProvider theme={theme}>
        <HashRouter>
            <App/>
        </HashRouter>
    </ThemeProvider>
    , document.getElementById('root'));
