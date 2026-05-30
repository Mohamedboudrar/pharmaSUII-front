import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={20} className="text-success" />,
  error: <XCircle size={20} className="text-danger" />,
  info: <Info size={20} className="text-primary" />,
};

const colors = {
  success: 'border-success-subtle',
  error: 'border-danger-subtle',
  info: 'border-primary-subtle',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="position-fixed top-0 end-0 p-3 d-flex flex-column gap-2" style={{ zIndex: 1080 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`d-flex align-items-center gap-2 px-3 py-3 rounded-4 border shadow-sm bg-white ${colors[t.type]}`}
              style={{ minWidth: 280 }}
            >
              {icons[t.type]}
              <p className="small fw-semibold text-dark mb-0 flex-grow-1">{t.message}</p>
              <button type="button" onClick={() => remove(t.id)} className="btn btn-sm btn-link text-secondary p-0">
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
