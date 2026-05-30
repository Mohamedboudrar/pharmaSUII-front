import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Clock, Star, Upload, Navigation, Shield, Pill } from 'lucide-react';
import { pharmacies } from '../utils/pharmacyData';

const PharmacyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pharmacy = pharmacies.find(p => p.id === parseInt(id));

  if (!pharmacy) return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <p className="text-secondary mb-0">Pharmacy not found</p>
    </div>
  );

  return (
    <div>
      <div className="container py-4 py-md-5" style={{ maxWidth: 860 }}>
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="btn btn-link text-secondary p-0 d-inline-flex align-items-center gap-2 mb-3"
        >
          <ArrowLeft size={18} />
          <span className="fw-semibold">Back to Map</span>
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ui-card p-4 p-md-5 mb-4"
        >
          {/* Top */}
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="brand-badge" style={{ fontSize: 28 }}>
                🏥
              </div>
              <div>
                <h1 className="ui-title h4 fw-bold mb-1">{pharmacy.name}</h1>
                <div className="d-flex align-items-center gap-2">
                  <Star size={16} className="text-warning" fill="currentColor" />
                  <span className="fw-semibold">{pharmacy.rating}</span>
                  <span className="text-secondary">({pharmacy.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <span className={`badge rounded-pill px-3 py-2 ${pharmacy.open ? 'text-bg-success' : 'text-bg-danger'}`}>
              {pharmacy.open ? '● Open Now' : '● Closed'}
            </span>
          </div>

          {/* Info rows */}
          <div className="d-grid gap-2">
            {[
              { icon: MapPin, label: 'Address', value: pharmacy.address, color: 'var(--teal)' },
              { icon: Phone, label: 'Phone', value: pharmacy.phone, color: '#0ea5e9' },
              { icon: Clock, label: 'Hours', value: pharmacy.hours, color: '#7c3aed' },
              { icon: Navigation, label: 'Distance', value: pharmacy.distance, color: '#f97316' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="d-flex align-items-center gap-3 p-3 rounded-4" style={{ background: 'rgba(248, 250, 252, 0.85)' }}>
                <div className="d-flex align-items-center justify-content-center bg-white rounded-3 shadow-sm" style={{ width: 36, height: 36 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <div className="small text-secondary">{label}</div>
                  <div className="fw-semibold">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ui-card p-4 p-md-5 mb-4 shadow-lg"
        >
          <h2 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
            <Pill size={16} className="text-teal" />
            Specialties
          </h2>
          <div className="d-flex flex-wrap gap-2">
            {pharmacy.specialties.map(s => (
              <span key={s} className="ui-chip">{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Upload CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/upload/${pharmacy.id}`)}
            className="btn ui-btn-primary w-100 py-3 fs-5 fw-bold rounded-4 d-flex align-items-center justify-content-center gap-2"
          >
            <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)' }}>
              <Upload color="white" size={18} />
            </div>
            Upload Prescription
          </motion.button>

          <div className="d-flex align-items-center gap-2 mt-3 justify-content-center">
            <Shield size={16} className="text-teal" />
            <p className="small text-secondary mb-0">Your prescription is encrypted and secure</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacyDetailsPage;
