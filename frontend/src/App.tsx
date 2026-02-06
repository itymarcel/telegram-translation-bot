import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import ChatDetail from './pages/ChatDetail';
import Translations from './pages/Translations';
import Settings from './pages/Settings';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chats/:chatId" element={<ChatDetail />} />
        <Route path="/translations" element={<Translations />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
