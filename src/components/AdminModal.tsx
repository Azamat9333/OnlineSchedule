import React, { useState } from 'react';
import { useGoogleSync } from '../context/GoogleSyncContext';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { sheetUrl, saveConfig, refreshData, isLoading, error, source } = useGoogleSync();
  const [inputSheetUrl, setInputSheetUrl] = useState(sheetUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(inputSheetUrl.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleClear = () => {
    setInputSheetUrl('');
    saveConfig('');
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">
              Панель управления расписанием (Google Таблица)
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Закрыть"
            />
          </div>

          <div className="modal-body p-4">
            <div className="mb-4">
              {source === 'google' ? (
                <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                  <div>
                    <strong>Онлайн-синхронизация активна!</strong>
                    <div className="small text-muted">
                      Расписание автоматически обновляется из Google Таблицы.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={() => refreshData()}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Обновление...' : 'Обновить сейчас'}
                  </button>
                </div>
              ) : (
                <div className="alert alert-secondary mb-0">
                  <strong>Используется базовое расписание колледжа.</strong>
                  <div className="small text-muted">
                    Вставьте ссылку на Google Таблицу ниже, чтобы сайт читал расписание из неё.
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger mt-2 mb-0">
                  <strong>Ошибка:</strong> {error}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Ссылка на Google Таблицу (опубликованный CSV или URL таблицы):
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  value={inputSheetUrl}
                  onChange={(e) => setInputSheetUrl(e.target.value)}
                />
                <div className="form-text">
                  В вашей Google Таблице: <strong>Файл</strong> ➔ <strong>Поделиться</strong> ➔{' '}
                  <strong>Опубликовать в интернете</strong> ➔ формат <strong>CSV</strong>.
                </div>
              </div>

              {saveSuccess && (
                <div className="alert alert-success py-2">
                  ✓ Ссылка сохранена! Расписание обновлено.
                </div>
              )}

              <div className="d-flex gap-2 justify-content-end">
                {sheetUrl && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleClear}
                  >
                    Отключить Google Таблицу
                  </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Загрузка...' : 'Сохранить'}
                </button>
              </div>
            </form>

            <hr className="my-4" />

            <h6 className="fw-bold mb-2">Структура колонок Google Таблицы:</h6>
            <div className="small text-muted">
              Колонки первой строки таблицы:
              <br />
              <code>День | Время | Группа | Курс | Преподаватель | Дисциплина</code>
            </div>
          </div>

          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
