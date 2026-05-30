import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UploadCloud, Shield } from 'lucide-react';
import { pharmacies } from '../utils/pharmacyData';
import { useToast } from '../components/Toast';
import { prescriptionsAPI } from '../api/axios';

const UploadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const pharmacy = pharmacies.find(p => p.id === parseInt(id));
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast('Please choose a file first', 'info');
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pharmacyId', id);

    prescriptionsAPI
      .upload(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      })
      .then(() => {
        toast('Prescription uploaded successfully', 'success');
        navigate('/prescriptions');
      })
      .catch((err) => {
        toast(err.response?.data?.message || 'Upload failed. Please try again.', 'error');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div>
      <div className="container py-4 py-md-5" style={{ maxWidth: 860 }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link text-secondary p-0 d-inline-flex align-items-center gap-2 mb-3"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="ui-card p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
            <div>
              <h1 className="ui-title h5 fw-bold mb-1">Upload prescription</h1>
              <p className="text-secondary mb-0">
                {pharmacy ? `For ${pharmacy.name}` : 'Choose a pharmacy and upload your Rx.'}
              </p>
            </div>
            <div className="ui-chip">
              <Shield size={14} className="me-1" />
              Encrypted
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="rounded-4 border bg-white bg-opacity-75 p-4">
              <label className="form-label fw-semibold">Prescription file</label>
              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="form-control ui-input"
                  disabled={uploading}
                />
                <button
                  type="submit"
                  className="btn ui-btn-primary px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={uploading}
                >
                  <UploadCloud size={16} />
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
              {uploading ? (
                <div className="mt-3">
                  <div className="d-flex align-items-center justify-content-between small text-secondary mb-2">
                    <span>Uploading</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress" role="progressbar" aria-label="Upload progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'var(--teal)' }} />
                  </div>
                </div>
              ) : null}
              {file ? (
                <div className="mt-3 small text-secondary">
                  Selected: <span className="fw-semibold">{file.name}</span>
                </div>
              ) : null}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
