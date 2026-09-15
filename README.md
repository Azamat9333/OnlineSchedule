# OnlineSchedule

Веб-приложение для просмотра расписания занятий студентов и преподавателей колледжа.

## Стек технологий
- **React 19 + TypeScript**
- **Vite 6** (быстрая сборка и лёгкий деплой)
- **Tailwind CSS**

---

## 🚀 Как опубликовать проект в Vercel.app через GitHub

Проект полностью настроен для развёртывания на Vercel (включая `vercel.json` с маршрутизацией для SPA).

### Шаг 1: Экспорт в GitHub
1. В AI Studio нажмите на кнопку экспорта / меню и выберите **«Export to GitHub»** или скачайте репозиторий в виде ZIP.
2. Если скачали ZIP, распакуйте его и загрузите в ваш репозиторий на GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of OnlineSchedule"
   git branch -M main
   git remote add origin https://github.com/<ваш-логин>/<имя-репозитория>.git
   git push -u origin main
   ```

### Шаг 2: Развёртывание на Vercel
1. Перейдите на сайт [vercel.com](https://vercel.com) и авторизуйтесь через свой аккаунт GitHub.
2. На панели управления нажмите **«Add New...» → «Project»**.
3. Найдите ваш репозиторий `OnlineSchedule` в списке и нажмите **«Import»**.
4. В разделе настроек:
   - **Framework Preset**: `Vite` (выбирается автоматически)
   - **Build Command**: `vite build` (по умолчанию)
   - **Output Directory**: `dist` (по умолчанию)
5. Нажмите кнопку **«Deploy»**.

Через 20–30 секунд ваш сайт будет активен и доступен по адресу:
`https://ваш-проект.vercel.app`
