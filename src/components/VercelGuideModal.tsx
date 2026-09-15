import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Globe } from 'lucide-react';

interface VercelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelGuideModal: React.FC<VercelGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-base">
              Публикация на Vercel.app через GitHub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <p className="text-gray-600">
            Проект полностью настроен для моментального развёртывания на{' '}
            <span className="font-semibold text-gray-900">Vercel</span>: создан{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-blue-700">vercel.json</code>,
            настроен Vite и оптимизирован статический билд.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200/60">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Экспорт в GitHub</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  В правом верхнем углу интерфейса Google AI Studio нажмите меню настроек/экспорта и выберите{' '}
                  <strong>«Export to GitHub»</strong> (или выгрузите ZIP и сделайте <code>git push</code> в свой репозиторий).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200/60">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Подключение в Vercel</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Перейдите на{' '}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    vercel.com <ExternalLink className="w-3 h-3" />
                  </a>
                  , войдите через GitHub и нажмите кнопку <strong>«Add New...» → «Project»</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200/60">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Нажмите «Deploy»</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Vercel автоматически определит Vite. Менять настройки не требуется. Через 30 секунд ваш сайт будет доступен по ссылке вида <code>https://ваше-имя.vercel.app</code>!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition cursor-pointer"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
