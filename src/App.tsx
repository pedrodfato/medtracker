import './App.css'
import { PrivateRoute } from './components/PrivateRoute';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OnBoarding } from './pages/onBoarding';
import { MedicationList } from './pages/medicationList';
import { AddMedication } from './pages/addMedications';
import { OpenRoute } from './components/OpenRoute';



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OpenRoute><OnBoarding /></OpenRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/login" element={<OpenRoute><Login/></OpenRoute>}/>
        <Route path="/List" element={<PrivateRoute><MedicationList /></PrivateRoute>} />
        <Route path="/Add" element={<PrivateRoute><AddMedication /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
