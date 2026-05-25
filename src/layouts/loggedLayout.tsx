import { Outlet } from 'react-router-dom';
import { Menu } from '../components/bottomMenu'; 

export function LogadoLayout() {
  return (
    <div>
      <Outlet /> 
      <Menu />
    </div>
  )
}