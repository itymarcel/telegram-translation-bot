import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Languages, Settings } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAppStore } from '../store/useAppStore';
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { telegramStatus } = useWebSocket();
  const setTelegramStatus = useAppStore((state) => state.setTelegramStatus);

  useEffect(() => {
    setTelegramStatus(telegramStatus);
  }, [telegramStatus, setTelegramStatus]);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/chats', icon: MessageSquare, label: 'Chats' },
    { path: '/translations', icon: Languages, label: 'Translations' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const getStatusColor = () => {
    if (telegramStatus.ready) return 'bg-green-500';
    if (telegramStatus.connected) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <nav style={{
        width: '250px',
        background: 'white',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>Telegram Translator</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
            }} className={getStatusColor()}></div>
            <span>{telegramStatus.ready ? 'Bot Ready' : telegramStatus.connected ? 'Connecting' : 'Disconnected'}</span>
          </div>
        </div>

        <ul style={{ listStyle: 'none', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path} style={{ marginBottom: '8px' }}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive ? '#10b981' : '#666',
                    background: isActive ? '#ecfdf5' : 'transparent',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: '30px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
