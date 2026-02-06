import { create } from 'zustand';
import type { Chat, Translation, TelegramStatus } from 'shared';

interface AppState {
  telegramStatus: TelegramStatus;
  chats: Chat[];
  translations: Translation[];
  selectedChatId: string | null;

  setTelegramStatus: (status: TelegramStatus) => void;
  setChats: (chats: Chat[]) => void;
  setTranslations: (translations: Translation[]) => void;
  setSelectedChatId: (chatId: string | null) => void;
  addTranslation: (translation: Translation) => void;
}

export const useAppStore = create<AppState>((set) => ({
  telegramStatus: {
    connected: false,
    ready: false,
  },
  chats: [],
  translations: [],
  selectedChatId: null,

  setTelegramStatus: (status) => set({ telegramStatus: status }),
  setChats: (chats) => set({ chats }),
  setTranslations: (translations) => set({ translations }),
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
  addTranslation: (translation) =>
    set((state) => ({
      translations: [translation, ...state.translations],
    })),
}));
