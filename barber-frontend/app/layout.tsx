import React, { ReactNode } from 'react';
import Navegation from '../components/nav_bar';

import '../styles/globals.css';

interface RootLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export default function RootLayout({ children, showNavbar = false }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>El Salon de la Fama</title>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
        <link rel="shortcut icon" href="https://raw.githubusercontent.com/Jonvtvn/Other/main/logo.png" />
      </head>
      <body>
        {showNavbar && <Navegation />}
        {children}
      </body>
    </html>
  );
}