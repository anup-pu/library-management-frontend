import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';

function App() {
  return (
    <LoaderProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LoaderProvider>
  );
}

export default App;
