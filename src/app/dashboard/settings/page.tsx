"use client";

import React, { useEffect } from 'react';
import { useSettingStore } from '@/store/useSettingStore';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { MODEL_API_URL_MAP } from '@/constant/modals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useTranslation, Trans } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = React.useState(false);
  const {
    apiKey,
    baseUrl,
    model,
    maxTokens,
    setApiKey,
    setBaseUrl,
    setModel,
    setMaxTokens,
    isDirty,
    saveSettings,
    resetSettings,
    loadSettings,
  } = useSettingStore();

  useEffect(() => {
    loadSettings();
    setIsMounted(true);
  }, [loadSettings]);

  if (!isMounted) return null;

  const handleSave = () => {
    saveSettings();
    toast.success(t('settings.notifications.settingsSaved'));
  };

  const handleReset = () => {
    resetSettings();
    toast.info(t('settings.notifications.changesReset'));
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);

    const officialUrl = MODEL_API_URL_MAP[newModel as keyof typeof MODEL_API_URL_MAP];
    const isOfficialUrl = Object.values(MODEL_API_URL_MAP).includes(baseUrl);

    if (officialUrl && (!baseUrl || isOfficialUrl)) {
      setBaseUrl(officialUrl);
    }
  };

  return (
    <div className="relative flex-1 overflow-y-auto px-12 py-10">
      <h1 className="text-3xl font-bold mb-4">{t('settings.title')}</h1>
      
      <div className="space-y-12 max-w-4xl pb-24">
        <section id="llm-settings">
          <h2 className="text-2xl font-semibold mb-2">{t('settings.llm.title')}</h2>
          <p className="mb-4 text-sm text-slate-600">
            {t('settings.llm.description1')}
          </p>
          <p className="mb-4 text-sm text-slate-600">
            <Trans i18nKey="settings.llm.description2">
              You have the option to <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">obtain your own OpenAI API key</a>. This key empowers you to leverage the API as you see fit. Alternatively, if you wish to disable the AI features in Reactive Resume altogether, you can simply remove the key from your settings.
            </Trans>
          </p>
          <p className="mb-4 text-sm text-slate-600">
            {t('settings.llm.description3')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label htmlFor="apiKey" className="mb-2 block text-sm font-medium text-slate-700">{t('settings.llm.apiKeyLabel')}</label>
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="baseUrl" className="mb-2 block text-sm font-medium text-slate-700">{t('settings.llm.baseUrlLabel')}</label>
              <Input
                id="baseUrl"
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:11434/v1"
                className="w-full rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="model" className="mb-2 block text-sm font-medium text-slate-700">{t('settings.llm.modelLabel')}</label>
              <Select onValueChange={handleModelChange} value={model}>
                <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 shadow-sm">
                  <SelectValue placeholder={t('settings.llm.modelPlaceholder')} />
                </SelectTrigger>
                <SelectContent className='border-slate-200 bg-white text-slate-900 focus:outline-0'>
                  {Object.keys(MODEL_API_URL_MAP).map((modelName) => (
                    <SelectItem key={modelName} value={modelName}>
                      {modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="maxTokens" className="mb-2 block text-sm font-medium text-slate-700">{t('settings.llm.maxTokensLabel')}</label>
              <Input
                id="maxTokens"
                type="number"
                value={maxTokens}
                max={65536}
                min={1024}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                placeholder="1024"
                className="w-full rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isDirty && (
          <motion.div
            className="fixed bottom-6 left-1/2 z-50 flex w-auto -translate-x-1/2 items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-2 shadow-xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <InfoCircledIcon className="h-5 w-5 text-slate-700" />
              <p className="text-sm font-medium text-slate-800">{t('settings.notifications.unsavedChanges')}</p>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <Button onClick={handleReset} size="sm" variant="outline" className="h-6 rounded-2xl border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">{t('settings.buttons.reset')}</Button>
              <Button onClick={handleSave} size="sm" className="h-6 rounded-2xl">{t('settings.buttons.save')}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
