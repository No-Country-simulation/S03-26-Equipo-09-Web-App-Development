import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router'; // Importa la instancia desde la nueva ubicación

function App() {
  return <RouterProvider router={router} />;
}

export default App;