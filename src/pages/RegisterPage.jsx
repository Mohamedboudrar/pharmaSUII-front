import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';
import { authAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import AuthShell from '../components/AuthShell';

const RegisterPage = () => {
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', password: '' });
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
      const { data } = await authAPI.register(form);
      login(data.token);
      toast('Account created successfully! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullname', label: 'Full Name', type: 'text', placeholder: 'Mohamed Alami', icon: User },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '0612345678', icon: Phone },
  ];

  return (
    <AuthShell
      title="Create account"
      subtitle="Join PharmaFlow today"
      footer={
        <p className="text-center small text-secondary mb-0">
          Already have an account?{' '}
          <Link to="/login" className="link-teal fw-semibold">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit}>
        {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
          <div key={name} className="mb-3">
            <label className="form-label fw-semibold">{label}</label>
            <div className="position-relative">
              <div className="position-absolute top-50 translate-middle-y ms-3 text-teal">
                <Icon size={18} />
              </div>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                placeholder={placeholder}
                className="form-control ui-input ps-5 py-3"
              />
            </div>
          </div>
        ))}

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
              placeholder="Min. 6 characters"
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
            <>Create Account <ArrowRight size={18} /></>
          )}
        </motion.button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
