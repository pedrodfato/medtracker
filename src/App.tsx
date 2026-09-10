import './App.css'
import { PrivateRoute } from './components/PrivateRoute';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OnBoarding } from './pages/onBoarding';
import { MedicationList } from './pages/medicationList';
import { AddMedication } from './pages/addMedications';
import { OpenRoute } from './components/OpenRoute';
import { LogadoLayout } from './layouts/loggedLayout';
import { Reminder } from './pages/reminder';
import { Progress } from './pages/progress';



function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OpenRoute><OnBoarding /></OpenRoute>} />
        <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/register" element={<OpenRoute><Register /></OpenRoute>} />
        <Route element={<LogadoLayout />}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/list" element={<PrivateRoute><MedicationList /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><AddMedication /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        </Route>
        <Route path="/reminder" element={<PrivateRoute><Reminder /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
