import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Clock, FileText, Info, Ban } from 'lucide-react';
import { API_BASE_URL, prescriptionsAPI } from '../api/axios';

const resolveFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  const base = API_BASE_URL || window.location.origin;
  return new URL(fileUrl, base).toString();
};

const PrescriptionDetailsPage = () => {
  const statusStyles = {
    PENDING: 'bg-amber-100 text-amber-700 border border-amber-300',
    ACCEPTED: 'bg-blue-100 text-blue-700 border border-blue-300',
    READY: 'bg-green-100 text-green-700 border border-green-300',
    REJECTED: 'bg-red-100 text-red-700 border border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-600 border border-gray-300',
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const isCancelled = (item?.status ?? '').toUpperCase() === 'CANCELLED' || (item?.status ?? '').toUpperCase() === 'CANCELED';
  const canCancel = !!item?.id && !isCancelled;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    prescriptionsAPI.getById(id)
      .then(({ data }) => {
        if (cancelled) return;
        setItem(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || 'Could not load prescription.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <div className="container py-4 py-md-5" style={{ maxWidth: 860 }}>
        <button
          type="button"
          onClick={() => navigate('/prescriptions')}
          className="btn btn-link text-secondary p-0 d-inline-flex align-items-center gap-2 mb-3"
        >
          <ArrowLeft size={18} />
          Back to Prescriptions
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="ui-card p-4 p-md-5">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status" aria-hidden="true" style={{ color: 'var(--teal)' }} />
              <div className="small text-secondary mt-2">Loading…</div>
            </div>
          ) : error ? (
            <div className="alert alert-warning mb-0" role="alert">
              {error}
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <span className="brand-badge brand-badge--sm">
                    <FileText color="white" size={18} />
                  </span>
                  <h1 className="ui-title h5 fw-bold mb-0">Prescription</h1>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge rounded-pill px-3 py-2 ${statusStyles[(item?.status ?? '').toUpperCase()] ?? 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                    {item?.status ?? 'SUBMITTED'}
                  </span>
                  {canCancel ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                      disabled={cancelling}
                      onClick={async () => {
                        const ok = window.confirm('Are you sure you want to cancel this prescription?');
                        if (!ok) return;
                        try {
                          setCancelling(true);
                          await prescriptionsAPI.cancel(item.id);
                          setItem((prev) => (prev ? { ...prev, status: 'CANCELLED' } : prev));
                        } catch (err) {
                          setError(err.response?.data?.message || 'Cancel failed. Please try again.');
                        } finally {
                          setCancelling(false);
                        }
                      }}
                    >
                      <Ban size={14} />
                      {cancelling ? 'Cancelling…' : 'Cancel'}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 d-grid gap-2">
                <div className="d-flex align-items-center gap-2 text-secondary small">
                  <Building2 size={14} /> {item?.pharmacyName ?? `Pharmacy #${item?.pharmacyId ?? '—'}`}
                </div>
                <div className="d-flex align-items-center gap-2 text-secondary small">
                  <Clock size={14} /> {item?.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                </div>
                <div className="d-flex align-items-center gap-2 text-secondary small">
                  <Info size={14} /> {item?.note ?? 'No additional notes.'}
                </div>
              </div>

              {item?.fileUrl ? (
                <div className="mt-4">
                  <div className="fw-semibold mb-2">Uploaded file</div>
                  <div className="rounded-4 border bg-white bg-opacity-75 p-3">
                    <img
                      src={resolveFileUrl(item.fileUrl)}
                      alt="Uploaded prescription"
                      className="img-fluid rounded-3"
                      style={{ maxHeight: 520, width: '100%', objectFit: 'contain' }}
                      loading="lazy"
                    />
                    <div className="small text-secondary mt-2">
                      <a className="link-teal fw-semibold" href={resolveFileUrl(item.fileUrl)} target="_blank" rel="noreferrer">
                        Open original
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsPage;
