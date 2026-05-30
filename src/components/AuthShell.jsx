import { motion } from 'framer-motion';
import { Cross } from 'lucide-react';

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4">
      <div className="bg-blobs" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="position-relative w-100"
        style={{ maxWidth: 420 }}
      >
        <div className="ui-card p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="brand-badge mb-3">
              <Cross color="white" size={32} strokeWidth={2.5} />
            </div>
            <h1 className="ui-title h3 fw-bold mb-1">{title}</h1>
            {subtitle ? <p className="text-secondary mb-0">{subtitle}</p> : null}
          </div>

          {children}

          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthShell;
