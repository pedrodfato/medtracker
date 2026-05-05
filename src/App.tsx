import './App.css'
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
