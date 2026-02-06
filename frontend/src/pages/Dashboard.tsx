import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { translationsApi } from '../services/api';
import { MessageCircle, CheckCircle, Loader } from 'lucide-react';
import type { TranslationStats } from 'shared';

const Dashboard = () => {
  const telegramStatus = useAppStore((state) => state.telegramStatus);
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await translationsApi.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderTelegramStatus = () => {
    if (telegramStatus.ready && telegramStatus.botUsername) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '24px',
          background: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #10b981',
        }}>
          <CheckCircle size={32} color="#10b981" />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>Bot Ready!</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              Your translation bot is running and ready to chat
            </p>
            <div style={{
              padding: '12px',
              background: 'white',
              borderRadius: '4px',
              border: '1px solid #10b981',
            }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Start chatting:</p>
              <a
                href={`https://t.me/${telegramStatus.botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MessageCircle size={20} />
                @{telegramStatus.botUsername}
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (telegramStatus.connected) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
        }}>
          <Loader size={24} color="#f59e0b" className="animate-spin" />
          <div>
            <h3 style={{ fontWeight: '600', color: '#f59e0b' }}>Initializing Telegram Bot</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Please wait...</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        padding: '24px',
        background: '#fee2e2',
        borderRadius: '8px',
        border: '1px solid #ef4444',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Loader size={24} color="#ef4444" />
          <div>
            <h3 style={{ fontWeight: '600', color: '#ef4444' }}>Bot Not Connected</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Check your TELEGRAM_BOT_TOKEN in backend/.env</p>
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: 'white',
          borderRadius: '4px',
          fontSize: '14px',
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>Setup Instructions:</p>
          <ol style={{ paddingLeft: '20px', color: '#666' }}>
            <li>Open Telegram and search for @BotFather</li>
            <li>Send /newbot and follow the instructions</li>
            <li>Copy the bot token</li>
            <li>Add it to backend/.env as TELEGRAM_BOT_TOKEN</li>
            <li>Restart the backend server</li>
          </ol>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Dashboard</h1>

      <div style={{ marginBottom: '32px' }}>
        {renderTelegramStatus()}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Loader size={32} color="#10b981" className="animate-spin" style={{ margin: '0 auto' }} />
        </div>
      ) : stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          <StatCard label="Total Translations" value={stats.total_translations} />
          <StatCard label="Italian → English" value={stats.it_to_en} />
          <StatCard label="English → Italian" value={stats.en_to_it} />
          <StatCard label="Active Chats" value={stats.active_chats} />
          <StatCard label="Total Chats" value={stats.total_chats} />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div style={{
    padding: '24px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }}>
    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{label}</p>
    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{value}</p>
  </div>
);

export default Dashboard;
