import { useEffect, useState } from 'react';
import { translationsApi } from '../services/api';
import { Loader, Languages } from 'lucide-react';
import type { Translation } from 'shared';
import toast from 'react-hot-toast';

const Translations = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTranslations();
  }, [page]);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const response = await translationsApi.getAll(page, 50);

      if (response.success && response.data) {
        setTranslations(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast.error('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Loader size={32} color="#10b981" className="animate-spin" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>All Translations</h1>

      {translations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '8px',
        }}>
          <Languages size={48} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No translations yet</h3>
          <p style={{ color: '#666' }}>Translations will appear here once messages are processed</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 16px',
                  background: page === 1 ? '#e5e5e5' : '#10b981',
                  color: page === 1 ? '#666' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={{ color: '#666' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '8px 16px',
                  background: page === totalPages ? '#e5e5e5' : '#10b981',
                  color: page === totalPages ? '#666' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Translations;
