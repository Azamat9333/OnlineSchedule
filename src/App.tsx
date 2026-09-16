/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { GoogleSyncProvider } from './context/GoogleSyncContext';
import { StudentSchedule } from './components/StudentSchedule';
import { TeacherSchedule } from './components/TeacherSchedule';
import { AdminModal } from './components/AdminModal';

// ==========================================
// 📢 НАСТРОЙКИ И ТЕКСТ ОБЪЯВЛЕНИЯ ПРЯМО ЗДЕСЬ:
// ==========================================
const ANNOUNCEMENT = {
  enabled: true, // true = показывать, false = скрыть
  title: '📢 Важное объявление',
  message: 'Внимание студентам и преподавателям: расписание на текущую неделю обновлено! Следите за изменениями в аудиториях.',
  type: 'warning', // 'warning' (жёлтый), 'danger' (красный), 'info' (синий), 'success' (зелёный)
  date: 'Обновлено сегодня',
};

const ROUTE_STUDENT = '/';
const ROUTE_TEACHER = '/teacher';

function MainNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to={ROUTE_STUDENT}>
          OnlineSchedule
        </Link>
        <div className="ms-auto">
          <Routes>
            <Route
              path={ROUTE_STUDENT}
              element={
                <Link to={ROUTE_TEACHER} className="btn btn-outline-info">
                  Режим Преподавателя
                </Link>
              }
            />
            <Route
              path={ROUTE_TEACHER}
              element={
                <Link to={ROUTE_STUDENT} className="btn btn-outline-warning">
                  Режим Студента
                </Link>
              }
            />
            <Route
              path="*"
              element={
                <Link to={ROUTE_STUDENT} className="btn btn-outline-light">
                  На главную
                </Link>
              }
            />
          </Routes>
        </div>
      </div>
    </nav>
  );
}

function MainContent() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      setIsAdminOpen(true);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <MainNavbar />

      <main className="container my-5 flex-grow-1">
        {/* БЛОК ОБЪЯВЛЕНИЯ */}
        {ANNOUNCEMENT.enabled && (
          <div className={`alert alert-${ANNOUNCEMENT.type} shadow-sm border mb-4 p-3 rounded-3`} role="alert">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="alert-heading mb-0 fw-bold fs-6">
                {ANNOUNCEMENT.title}
              </h5>
              {ANNOUNCEMENT.date && (
                <span className="badge bg-light text-dark border small fw-normal">
                  {ANNOUNCEMENT.date}
                </span>
              )}
            </div>
            <p className="mb-0 text-break" style={{ whiteSpace: 'pre-line' }}>
              {ANNOUNCEMENT.message}
            </p>
          </div>
        )}

        <Routes>
          <Route path={ROUTE_STUDENT} element={<StudentSchedule />} />
          <Route path={ROUTE_TEACHER} element={<TeacherSchedule />} />
          <Route
            path="*"
            element={
              <div className="alert alert-danger">
                404: Страница не найдена
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="footer mt-auto py-3 bg-light border-top">
        <div className="container text-center">
          <span
            className="text-muted"
            style={{ cursor: 'default', userSelect: 'none' }}
            onDoubleClick={() => setIsAdminOpen(true)}
          >
            © {new Date().getFullYear()} OnlineSchedule.
          </span>
        </div>
      </footer>

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GoogleSyncProvider>
        <MainContent />
      </GoogleSyncProvider>
    </BrowserRouter>
  );
}
