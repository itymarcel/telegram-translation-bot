import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { chatsApi } from '../services/api';
import { MessageSquare, Loader } from 'lucide-react';
import type { Chat } from 'shared';
import toast from 'react-hot-toast';

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await chatsApi.getAll();
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Loader size={32} color="#10b981" className="animate-spin" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Chats</h1>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '8px',
        }}>
          <MessageSquare size={48} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No chats yet</h3>
          <p style={{ color: '#666' }}>Send a message to your Telegram bot to start translating</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Chats</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chats/${chat.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
            }}>
              {chat.contact_name.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>{chat.contact_name}</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>{chat.contact_number}</p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '14px', color: '#666' }}>
              <p>{new Date(chat.last_message_at).toLocaleDateString()}</p>
              <p>{new Date(chat.last_message_at).toLocaleTimeString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Chats;
