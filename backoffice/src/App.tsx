
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Layout } from './components/Layout/Layout';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setCredentials } from './store/slices/authSlice';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Voitures } from './pages/Voitures';
import { Reservations } from './pages/Reservations';
import { ListeReservations } from './pages/ListeReservations';
import { Admins } from './pages/Admins';
import { Benefices } from './pages/Benefices';
import { Chauffeurs } from './pages/Chauffeurs';

const AppContent: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth); 
  const isAuthenticated = !!token; 
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
     const savedUser = localStorage.getItem('user');
  if (savedToken && savedUser && !isAuthenticated) {
    dispatch(setCredentials({ 
      user: JSON.parse(savedUser), 
      token: savedToken 
    }));
  } 
}, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Login />;
  }


  return (
    <Layout>
      <Routes>
       
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/voitures" element={<Voitures />} />
        <Route path="/chauffeurs" element={<Chauffeurs />} />
        <Route path="/ListeReservations" element={<ListeReservations />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/benefices" element={<Benefices />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <AppContent />
        </div>
      </Router>
    </Provider>
  );
}

export default App;