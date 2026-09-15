import React, { useState, useMemo } from 'react';
import { DayOfWeek } from '../types';
import { DAYS, scheduleItems } from '../data/scheduleParser';

const STORAGE_KEY = 'savedTeacherName';

export const TeacherSchedule: React.FC = () => {
  const [teacherInput, setTeacherInput] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) || ''
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DAYS[0]);

  const filteredLessons = useMemo(() => {
    if (!teacherInput) return [];
    const search = teacherInput.trim().toUpperCase();
    return scheduleItems
      .filter(
        (lesson) =>
          lesson.day === selectedDay &&
          lesson.discipline.toUpperCase().includes(search)
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [teacherInput, selectedDay]);

  const handleSave = () => {
    if (teacherInput.trim()) {
      localStorage.setItem(STORAGE_KEY, teacherInput.trim());
    }
  };

  const capitalizeDay = (day: string) =>
    day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

  return (
    <>
      <div className="p-5 mb-4 bg-warning bg-opacity-10 rounded-3 text-center">
        <h1 className="display-5 fw-bold text-warning">Расписание для Преподавателей</h1>
        <p className="lead">
          Введите фамилию (например, **Керимов**) и нажмите "Сохранить", чтобы запомнить выбор.
        </p>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="card-title">Параметры поиска: Фамилия и День</h5>
          <div className="row g-3">
            <div className="col-md-5">
              <label htmlFor="teacherInput" className="form-label">
                Фамилия преподавателя
              </label>
              <input
                type="text"
                className="form-control"
                id="teacherInput"
                value={teacherInput}
                onChange={(e) => setTeacherInput(e.target.value)}
                placeholder="Например, Керимов"
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
                id="saveTeacherBtn"
                className="btn btn-warning w-100"
                disabled={!teacherInput}
                onClick={handleSave}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      {teacherInput && (
        <div className="mt-5">
          <h2 className="mb-3">
            Нагрузка преподавателя **{teacherInput}** на **{capitalizeDay(selectedDay)}**
          </h2>
          <div className="table-responsive shadow-sm">
            <table className="table table-hover table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Время</th>
                  <th>Группа</th>
                  <th>Дисциплина</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson, idx) => (
                    <tr key={idx} className="table-warning">
                      <th>{lesson.time}</th>
                      <td>
                        {lesson.groupName} ({lesson.course})
                      </td>
                      <td>{lesson.discipline}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      {teacherInput
                        ? `Преподаватель ${teacherInput} не ведет занятия ${capitalizeDay(selectedDay)}.`
                        : 'Введите фамилию для поиска.'}
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
