import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FileText, UploadCloud, Clock, Building2, Eye } from 'lucide-react';
import { prescriptionsAPI } from '../api/axios';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

const PrescriptionsPage = () => {
  const statusStyles = {
    PENDING: 'bg-amber-100 text-amber-700 border border-amber-300',
    ACCEPTED: 'bg-blue-100 text-blue-700 border border-blue-300',
    READY: 'bg-green-100 text-green-700 border border-green-300',
    REJECTED: 'bg-red-100 text-red-700 border border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-600 border border-gray-300',
  };

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    prescriptionsAPI.getAll()
      .then(({ data }) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : (data?.items ?? []));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || 'Could not load prescriptions.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = items.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return (p.status ?? '').toUpperCase() === statusFilter;
  });

  return (
    <div>
      <div className="container py-4 py-md-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="ui-card p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="brand-badge brand-badge--sm">
                  <FileText color="white" size={18} />
                </span>
                <h1 className="ui-title h5 fw-bold mb-0">Prescriptions</h1>
              </div>
              <p className="text-secondary mb-0 mt-2">
                Upload a prescription from a pharmacy details screen to see it here.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select form-select-sm"
                style={{ width: 170 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter prescriptions by status"
              >
                <option value="ALL">All statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="READY">READY</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                onClick={() => {
                  toast('Open a pharmacy and tap Upload Prescription', 'info');
                }}
              >
                <UploadCloud size={16} />
                Upload
              </button>
            </div>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" aria-hidden="true" style={{ color: 'var(--teal)' }} />
                <div className="small text-secondary mt-2">Loading prescriptions…</div>
              </div>
            ) : error ? (
              <div className="alert alert-warning mb-0" role="alert">
                {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-4 border bg-white bg-opacity-75 p-4 text-center">
                <p className="fw-semibold mb-1">No prescriptions yet</p>
                <p className="small text-secondary mb-0">
                  Search for a pharmacy on the map and upload your prescription.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {filteredItems.map((p) => (
                  <div key={p.id ?? `${p.createdAt ?? ''}-${p.pharmacyId ?? ''}`} className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <span className={`badge rounded-pill px-3 py-2 ${statusStyles[(p.status ?? '').toUpperCase()] ?? 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                                {p.status ?? 'SUBMITTED'}
                              </span>
                            </div>
                            <div className="small text-secondary d-flex align-items-center gap-2 mt-1">
                              <span className="d-inline-flex align-items-center gap-1">
                                <Building2 size={14} /> {p.pharmacyName ?? `Pharmacy #${p.pharmacyId ?? '-'}`}
                              </span>
                              <span className="d-inline-flex align-items-center gap-1">
                                <Clock size={14} /> {p.createdAt ? new Date(p.createdAt).toLocaleString() : '—'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                            onClick={() => {
                              if (!p.id) return;
                              navigate(`/prescriptions/${p.id}`);
                            }}
                            disabled={!p.id}
                          >
                            <Eye size={14} /> View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
