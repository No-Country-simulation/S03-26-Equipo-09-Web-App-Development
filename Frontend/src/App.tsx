// App component
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/-router'; // Importa la instancia desde src/routes

function App() {
  return <RouterProvider router={router} />;
}

export default App;