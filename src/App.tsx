import React from 'react';
import { AppProvider } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';

export default function App() {
  return (
    <AppProvider>
      <MobileFrame />
    </AppProvider>
  );
}

