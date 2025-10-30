import { Outlet } from 'react-router-dom';

export const AdminMainContent = () => {
  return (
    <main className="flex-1 p-6 overflow-y-auto pb-24">
      <Outlet />
    </main>
  );
};
