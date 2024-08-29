'use client';
import React, { forwardRef } from 'react';
import NextLink from 'next/link';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
const NextLinkInjector = forwardRef(function LinkBehaviour(props, ref) {
    return <NextLink ref={ref} {...props} />;
});

export default function ThemeWrapper({ children }) {
    return (
        <ThemeProvider
            theme={createTheme({
                components: {
                    MuiLink: {
                        defaultProps: {
                            component: NextLinkInjector,
                        },
                    },
                },
                palette: {
                    primary: {
                        main: '#095d99',
                    },
                    secondary: {
                        main: '#c7eaec',
                        dark: '#0066CC',
                    },
                },
            })}
        >
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}