import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import { useEffect } from 'react';
import API from './services/api'; // import your axios instance

function App() {
  useEffect(() => {
    // 👇 Ping backend once when app loads
    API.get('/ping')
      .then(() => console.log('✅ Backend warmed up'))
      .catch(() => console.log('❌ Backend warm-up failed'));
  }, []);

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
