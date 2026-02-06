import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { TelegramStatus } from 'shared';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus>({
    connected: false,
    ready: false,
  });

  useEffect(() => {
    const socketInstance = io(WS_URL);

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socketInstance.on('telegram-ready', (botInfo: { username: string; name: string }) => {
      console.log('Telegram bot ready:', botInfo);
      setTelegramStatus({
        connected: true,
        ready: true,
        botUsername: botInfo.username,
        botName: botInfo.name,
      });
    });

    socketInstance.on('telegram-status', (status: TelegramStatus) => {
      console.log('Telegram status update:', status);
      setTelegramStatus(status);
    });

    socketInstance.on('telegram-error', (error: string) => {
      console.error('Telegram error:', error);
      setTelegramStatus((prev) => ({ ...prev, connected: false, ready: false }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, connected, telegramStatus };
};
