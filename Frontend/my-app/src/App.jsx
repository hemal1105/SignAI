import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Translate from './pages/Translate';
import Progress from './pages/Progress';
import Emotions from './pages/Emotions';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/progress" element={<Progress />} />
             <Route path="/emotions" element={<Emotions />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;