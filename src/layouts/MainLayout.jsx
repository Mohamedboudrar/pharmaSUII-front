import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => (
  <div className="position-relative min-vh-100">
    <div className="bg-blobs" />
    <Navbar />
    <main style={{ paddingTop: 88, paddingBottom: 32 }}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
