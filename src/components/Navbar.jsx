import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, FileText, LogOut, Cross } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: Map, label: 'Map' },
    { to: '/prescriptions', icon: FileText, label: 'Prescriptions' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="navbar nav-glass glass-strong fixed-top shadow-sm"
    >
      <div className="container-fluid px-3 px-md-4">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2">
          <span className="brand-badge brand-badge--sm">
            <Cross color="white" size={18} strokeWidth={2.5} />
          </span>
          <span className="ui-title fw-bold text-dark mb-0">PharmaSUIIII</span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          {links.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`btn btn-sm d-flex align-items-center gap-2 ${
                  active ? 'btn-success' : 'btn-outline-secondary'
                }`}
                style={active ? { backgroundColor: 'var(--teal)', borderColor: 'var(--teal)' } : undefined}
              >
                <Icon size={16} />
                <span className="d-none d-sm-inline">{label}</span>
              </Link>
            );
          })}

          <button onClick={handleLogout} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2">
            <LogOut size={16} />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
