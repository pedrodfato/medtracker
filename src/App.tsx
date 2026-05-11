import './App.css'
import { PrivateRoute } from './components/PrivateRoute';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OnBoarding } from './pages/onBoarding';



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
