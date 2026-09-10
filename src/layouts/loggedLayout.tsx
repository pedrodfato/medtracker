import { Outlet } from 'react-router-dom';
import { Menu } from '../components/bottomMenu'; 

export function LogadoLayout() {
  return (
    <div>
      <div className="pb-28">
        <Outlet />
      </div>
      <Menu />
    </div>
  )
}