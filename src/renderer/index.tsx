import { render } from 'react-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import shadows, { Shadows } from '@mui/material/styles/shadows';
import CssBaseline from "@mui/material/CssBaseline";

import App from './app/index';

import './reset.css';
import './index.sass';
import { HashRouter, Routes } from 'react-router-dom';

declare module '@mui/material/styles' {
    interface TypographyVariants {
      h7: React.CSSProperties;
    }
  
    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
      h7?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        h7: true;
    }
}

const theme = createTheme({
    shadows: shadows.map(() => 'none') as Shadows,
    shape: {
        borderRadius: 0
    },
    typography: {
        fontFamily: [
            '"Inter"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1 : {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '40px',
            lineHeight: '60px'
        },
        h2: {
            fontStyle: 'normal',
            fontWeight: '800',
            fontSize: '32px',
            lineHeight: '39px',
        },
        h3: {
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '28px',
            lineHeight: '34px',
        },
        h4: {
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '28px',
            lineHeight: '34px',
        },
        h5: {
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '24px',
            lineHeight: '30px',
            marginBottom: 16
        },
        h6: {
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '20px',
            lineHeight: '26px',
            marginBottom: 16
        },
        h7: {
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '18px',
            lineHeight: '22px',
        }
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
        background: {
            default: '#252526',
            paper: '#252526',
            // paper: '#333333'
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.5)',
            disabled: 'rgba(255, 255, 255, 0.2)'
        },
        action: {
            active: '#fff',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)'
        }
    }
});

render(
    <ThemeProvider theme={theme}>
        <HashRouter>
            <CssBaseline/>
            <App/>
        </HashRouter>
    </ThemeProvider>
    , document.getElementById('root'));
