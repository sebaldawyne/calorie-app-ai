import { useState, useEffect } from 'react';

// Types
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface DailyLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  foodId?: string;
  name: string;
  calories: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
}

export interface UserSettings {
  calorieGoal: number;
  name: string;
}

// Default Settings
const DEFAULT_SETTINGS: UserSettings = {
  calorieGoal: 2000,
  name: 'Friend',
};

// Storage Keys
const KEYS = {
  LOGS: 'calsnap_logs',
  SETTINGS: 'calsnap_settings',
  CUSTOM_FOODS: 'calsnap_custom_foods',
};

// Helper Hooks

export function useLogs() {
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEYS.LOGS);
    if (stored) {
      setLogs(JSON.parse(stored));
    }
  }, []);

  const addLog = (log: Omit<DailyLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updatedLogs));
  };

  const removeLog = (id: string) => {
    const updatedLogs = logs.filter(l => l.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updatedLogs));
  };

  const resetLogs = () => {
    setLogs([]);
    localStorage.removeItem(KEYS.LOGS);
  };

  const getLogsByDate = (date: string) => {
    return logs.filter(log => log.date === date);
  };

  return { logs, addLog, removeLog, resetLogs, getLogsByDate };
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem(KEYS.SETTINGS);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  };

  return { settings, updateSettings };
}

export function useCustomFoods() {
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEYS.CUSTOM_FOODS);
    if (stored) {
      setCustomFoods(JSON.parse(stored));
    }
  }, []);

  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updated = [...customFoods, newFood];
    setCustomFoods(updated);
    localStorage.setItem(KEYS.CUSTOM_FOODS, JSON.stringify(updated));
  };

  return { customFoods, addCustomFood };
}
