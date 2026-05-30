import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import AuthShell from '../components/AuthShell';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token);
      toast('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your PharmaFlow account"
      footer={
        <p className="text-center small text-secondary mb-0">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="link-teal fw-semibold">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <div className="position-relative">
            <div className="position-absolute top-50 translate-middle-y ms-3 text-teal">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="form-control ui-input ps-5 py-3"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <div className="position-relative">
            <div className="position-absolute top-50 translate-middle-y ms-3 text-teal">
              <Lock size={18} />
            </div>
            <input
              type={showPw ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="form-control ui-input ps-5 pe-5 py-3"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-2 p-0 text-secondary"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn ui-btn-primary w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true" />
          ) : (
            <>Sign In <ArrowRight size={18} /></>
          )}
        </motion.button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
