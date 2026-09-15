import React, { useState, useMemo } from 'react';
import { DayOfWeek } from '../types';
import { DAYS, scheduleItems } from '../data/scheduleParser';

const STORAGE_KEY = 'savedGroupNumber';

export const StudentSchedule: React.FC = () => {
  const [groupInput, setGroupInput] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) || ''
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DAYS[0]);

  const filteredLessons = useMemo(() => {
    if (!groupInput) return [];
    const search = groupInput.trim().toUpperCase();
    return scheduleItems
      .filter(
        (lesson) =>
          lesson.day === selectedDay &&
          lesson.groupName.toUpperCase().includes(search)
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [groupInput, selectedDay]);

  const handleSave = () => {
    if (groupInput.trim()) {
      localStorage.setItem(STORAGE_KEY, groupInput.trim());
    }
  };

  const capitalizeDay = (day: string) =>
    day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

  return (
    <>
      <div className="p-5 mb-4 bg-light rounded-3 text-center">
        <h1 className="display-5 fw-bold text-primary">Расписание для Студентов</h1>
        <p className="lead">
          Введите код группы (например, 214) и нажмите "Сохранить", чтобы запомнить выбор.
        </p>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="card-title">Параметры поиска: Группа и День</h5>
          <div className="row g-3">
            <div className="col-md-5">
              <label htmlFor="groupInput" className="form-label">
                Код группы
              </label>
              <input
                type="text"
                className="form-control"
                id="groupInput"
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                placeholder="Например, 09-220"
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="daySelect" className="form-label">
                День недели
              </label>
              <select
                id="daySelect"
                className="form-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                id="saveGroupBtn"
                className="btn btn-primary w-100"
                disabled={!groupInput}
                onClick={handleSave}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      {groupInput && (
        <div className="mt-5">
          <h2 className="mb-3">
            Расписание для группы **{groupInput}** на **{capitalizeDay(selectedDay)}**
          </h2>
          <div className="table-responsive shadow-sm">
            <table className="table table-hover table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Время</th>
                  <th>Дисциплина</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson, idx) => (
                    <tr key={idx}>
                      <th>{lesson.time}</th>
                      <td>{lesson.discipline}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center text-muted">
                      {groupInput
                        ? `Нет занятий для группы ${groupInput} на ${capitalizeDay(selectedDay)}.`
                        : 'Введите код группы для поиска.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
