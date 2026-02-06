import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatsApi } from '../services/api';
import { ArrowLeft, Loader, Languages } from 'lucide-react';
import type { Chat, Translation } from 'shared';
import toast from 'react-hot-toast';

const ChatDetail = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [chat, setChat] = useState<Chat | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      fetchChatDetail();
    }
  }, [chatId]);

  const fetchChatDetail = async () => {
    try {
      const [chatResponse, messagesResponse] = await Promise.all([
        chatsApi.getById(chatId!),
        chatsApi.getMessages(chatId!),
      ]);

      if (chatResponse.success && chatResponse.data) {
        setChat(chatResponse.data);
      }

      if (messagesResponse.success && messagesResponse.data) {
        setTranslations(messagesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching chat detail:', error);
      toast.error('Failed to load chat details');
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

  if (!chat) {
    return (
      <div>
        <Link to="/chats" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', textDecoration: 'none', color: '#10b981' }}>
          <ArrowLeft size={20} />
          Back to Chats
        </Link>
        <p>Chat not found</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/chats" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', textDecoration: 'none', color: '#10b981' }}>
        <ArrowLeft size={20} />
        Back to Chats
      </Link>

      <div style={{
        padding: '24px',
        background: 'white',
        borderRadius: '8px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}>
            {chat.contact_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{chat.contact_name}</h1>
            <p style={{ color: '#666' }}>{chat.contact_number}</p>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Translation History</h2>

      {translations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '8px',
        }}>
          <Languages size={48} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No translations yet</h3>
          <p style={{ color: '#666' }}>Messages will appear here once translated</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {translations.map((translation) => (
            <div
              key={translation.id}
              style={{
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: translation.direction === 'it_to_en' ? '#dbeafe' : '#fef3c7',
                  color: translation.direction === 'it_to_en' ? '#1e40af' : '#92400e',
                }}>
                  {translation.direction === 'it_to_en' ? 'IT → EN' : 'EN → IT'}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(translation.timestamp).toLocaleString()}
                </span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Original:</p>
                <p style={{ fontSize: '16px' }}>{translation.original_text}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Translation:</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#10b981' }}>{translation.translated_text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
