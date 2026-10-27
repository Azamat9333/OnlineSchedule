import React from 'react';
import { ANNOUNCEMENT_CONFIG } from '../data/newsConfig';

export const AnnouncementBanner: React.FC = () => {
  if (!ANNOUNCEMENT_CONFIG.enabled) {
    return null;
  }

  return (
    <div
      className={`alert alert-${ANNOUNCEMENT_CONFIG.type} shadow-sm border mb-4 p-3 rounded-3`}
      role="alert"
    >
      <div className="d-flex align-items-center gap-2 mb-1">
        <h5 className="alert-heading mb-0 fw-bold fs-6">
          {ANNOUNCEMENT_CONFIG.title}
        </h5>
        {ANNOUNCEMENT_CONFIG.date && (
          <span className="badge bg-light text-dark border small fw-normal">
            {ANNOUNCEMENT_CONFIG.date}
          </span>
        )}
      </div>
      <p className="mb-0 text-break" style={{ whiteSpace: 'pre-line' }}>
        {ANNOUNCEMENT_CONFIG.message}
      </p>
    </div>
  );
};
