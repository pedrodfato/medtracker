import { Outlet } from 'react-router-dom';
import { Menu } from '../components/bottomMenu';
import { Sidebar } from '../components/sidebar';

export function LogadoLayout() {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 pb-28 lg:pb-8">
        <div className="mx-auto w-full max-w-[1400px] lg:px-6 lg:pt-5">
          <Outlet />
        </div>
      </div>
      <div className="lg:hidden">
        <Menu />
      </div>
    </div>
  )
}
