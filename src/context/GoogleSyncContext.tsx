import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScheduleItem } from '../types';
import { scheduleItems as staticScheduleItems } from '../data/scheduleParser';
import { loadScheduleFromCsv, loadGoogleConfig, saveGoogleConfig } from '../data/googleSync';

interface GoogleSyncContextType {
  schedule: ScheduleItem[];
  isLoading: boolean;
  error: string | null;
  sheetUrl: string;
  source: 'google' | 'static';
  saveConfig: (newSheetUrl: string) => void;
  refreshData: () => Promise<void>;
}

const GoogleSyncContext = createContext<GoogleSyncContextType | undefined>(undefined);

export const GoogleSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sheetUrl, setSheetUrl] = useState<string>(() => loadGoogleConfig().sheetUrl);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(staticScheduleItems);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'google' | 'static'>('static');

  const fetchFromSheet = async (url: string) => {
    if (!url || !url.trim()) {
      setSchedule(staticScheduleItems);
      setSource('static');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const items = await loadScheduleFromCsv(url.trim());
      if (items.length > 0) {
        setSchedule(items);
        setSource('google');
      } else {
        setSchedule(staticScheduleItems);
        setSource('static');
      }
    } catch (err: any) {
      console.error('Failed to sync from Google Sheet:', err);
      setError(err?.message || 'Ошибка загрузки данных из Google Таблицы');
      setSchedule(staticScheduleItems);
      setSource('static');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sheetUrl) {
      fetchFromSheet(sheetUrl);
    }
  }, [sheetUrl]);

  const saveConfig = (newSheetUrl: string) => {
    saveGoogleConfig(newSheetUrl);
    setSheetUrl(newSheetUrl);
    if (newSheetUrl) {
      fetchFromSheet(newSheetUrl);
    } else {
      setSchedule(staticScheduleItems);
      setSource('static');
    }
  };

  const refreshData = async () => {
    if (sheetUrl) {
      await fetchFromSheet(sheetUrl);
    }
  };

  return (
    <GoogleSyncContext.Provider
      value={{
        schedule,
        isLoading,
        error,
        sheetUrl,
        source,
        saveConfig,
        refreshData,
      }}
    >
      {children}
    </GoogleSyncContext.Provider>
  );
};

export const useGoogleSync = () => {
  const context = useContext(GoogleSyncContext);
  if (!context) {
    throw new Error('useGoogleSync must be used within a GoogleSyncProvider');
  }
  return context;
};
