import { create } from 'zustand';
import { dbClient } from '@/lib/IndexDBClient';
import { MODEL_API_URL_MAP } from '@/constant/modals';

// 移除立即初始化，改为懒加载
let dbInitialized = false;
const ensureDbInitialized = async () => {
  if (!dbInitialized && typeof window !== 'undefined') {
    try {
      await dbClient.init();
      dbInitialized = true;
    } catch (err) {
      console.error('Failed to init db for settings', err);
    }
  }
};

interface SettingsData {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
}

interface SettingsState extends SettingsData {
  initialSettings: SettingsData;
  isDirty: boolean;
  setApiKey: (apiKey: string) => void;
  setBaseUrl: (baseUrl: string) => void;
  setModel: (model: string) => void;
  setMaxTokens: (maxTokens: number) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  loadSettings: () => Promise<void>;
}

const defaultSettings: SettingsData = {
  apiKey: '',
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  maxTokens: 1024,
};

export const useSettingStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  initialSettings: { ...defaultSettings },
  isDirty: false,
  
  setApiKey: (apiKey) => {
    const currentState = { ...get(), apiKey };
    const { initialSettings, ...currentSettings } = currentState;
    set({ apiKey, isDirty: JSON.stringify(currentSettings) !== JSON.stringify(initialSettings) });
  },
  setBaseUrl: (baseUrl) => {
    const currentState = { ...get(), baseUrl };
    const { initialSettings, ...currentSettings } = currentState;
    set({ baseUrl, isDirty: JSON.stringify(currentSettings) !== JSON.stringify(initialSettings) });
  },
  setModel: (model) => {
    const currentState = { ...get(), model };
    const { initialSettings, ...currentSettings } = currentState;
    set({ model, isDirty: JSON.stringify(currentSettings) !== JSON.stringify(initialSettings) });
  },
  setMaxTokens: (maxTokens) => {
    const currentState = { ...get(), maxTokens };
    const { initialSettings, ...currentSettings } = currentState;
    set({ maxTokens, isDirty: JSON.stringify(currentSettings) !== JSON.stringify(initialSettings) });
  },
  
  saveSettings: async () => {
    await ensureDbInitialized();
    const { apiKey, baseUrl, model, maxTokens } = get();
    const newSettings = { apiKey, baseUrl, model, maxTokens };
    await dbClient.setItem('settings', newSettings);
    set({ initialSettings: newSettings, isDirty: false });
  },

  resetSettings: () => {
    set(state => ({
      ...state.initialSettings,
      isDirty: false,
    }));
  },

  loadSettings: async () => {
    await ensureDbInitialized();
    const savedSettings = await dbClient.getItem('settings') as SettingsData | null;
    if (savedSettings) {
      // 验证模型是否存在，不存在则使用默认值
      let validModel = savedSettings.model;
      let validBaseUrl = savedSettings.baseUrl;
      
      if (!Object.keys(MODEL_API_URL_MAP).includes(validModel)) {
        validModel = defaultSettings.model;
        validBaseUrl = defaultSettings.baseUrl; // 模型重置时，URL也重置以匹配
      }

      const validatedSettings = { 
        ...savedSettings, 
        model: validModel,
        baseUrl: validBaseUrl 
      };

      set({ ...validatedSettings, initialSettings: { ...validatedSettings }, isDirty: false });
    }
  },
}));

// 移除立即加载，改为按需加载
// useSettingStore.getState().loadSettings(); 