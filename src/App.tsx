/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { StudentSchedule } from './components/StudentSchedule';
import { TeacherSchedule } from './components/TeacherSchedule';
import { VercelGuideModal } from './components/VercelGuideModal';

const ROUTE_STUDENT = '/';
const ROUTE_TEACHER = '/teacher';

export default function App() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
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

        {/* Main View */}
        <main className="container my-5 flex-grow-1">
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

        {/* Footer */}
        <footer className="footer mt-auto py-3 bg-light border-top">
          <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-center">
            <span className="text-muted">
              © {new Date().getFullYear()} OnlineSchedule.
            </span>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="btn btn-link btn-sm text-decoration-none text-secondary p-0"
              style={{ fontSize: '0.8rem' }}
            >
              Инструкция деплоя на Vercel
            </button>
          </div>
        </footer>

        {/* Modal Guide */}
        <VercelGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}
