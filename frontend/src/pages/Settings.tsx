import { useState } from 'react';
import { configApi } from '../services/api';
import { Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    try {
      setSaving(true);
      const response = await configApi.updateApiKey(apiKey);

      if (response.success) {
        toast.success('API key updated successfully');
        setApiKey('');
      } else {
        toast.error(response.error || 'Failed to update API key');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      toast.error('Failed to update API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h1>

      <div style={{
        maxWidth: '600px',
        padding: '24px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Key size={24} color="#10b981" />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>OpenAI API Configuration</h2>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Your API key is stored securely and never shared. Get your key from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>
              OpenAI Dashboard
            </a>
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: saving ? '#ccc' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save API Key'}
        </button>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '4px',
          border: '1px solid #bae6fd',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#0284c7' }}>Note</h3>
          <ul style={{ fontSize: '14px', color: '#0c4a6e', paddingLeft: '20px' }}>
            <li>The server must be restarted after updating the API key</li>
            <li>Make sure you have sufficient credits in your OpenAI account</li>
            <li>GPT-4 Turbo is recommended for best translation quality</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '600px',
        padding: '24px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginTop: '24px',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>About</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          WhatsApp Translation Server v1.0.0
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Automatically translates messages between Italian and English using OpenAI GPT-4.
        </p>
      </div>
    </div>
  );
};

export default Settings;
