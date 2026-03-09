import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Translate from './pages/Translate';
import Progress from './pages/Progress';
import Emotions from './pages/Emotions';
import AlphabetModuleOne from './components/AlphabetModuleOne';
import AlphabetModuleTwo from './components/AlphabetModuleTwo';
import AlphabetModuleThree from './components/AlphabetModuleThree';
import AlphabetModuleFour from './components/AlphabetModuleFour';
import AlphabetModuleFive from './components/AlphabetModuleFive';
import AlphabetLevels from './components/AlphabetLevels';
import NumbersModule from './components/NumbersModule';
import AlphabetQuizOne from './components/AlphabetQuizOne';
import AlphabetQuizTwo from './components/AlphabetQuizTwo';
import AlphabetQuizThree from './components/AlphabetQuizThree';
import AlphabetQuizFour from './components/AlphabetQuizFour';
import AlphabetQuizFive from './components/AlphabetQuizFive';
import NumbersQuiz from './components/NumbersQuiz';
import QuizDashboard from './pages/QuizDashboard';
import AlphabetQuizMap from './pages/AlphabetQuizMap';
import AlphabetQuizMaster from './components/AlphabetQuizMaster';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/numbers" element={<NumbersModule />} />
          <Route path="/quizzes" element={<QuizDashboard />} />
          <Route path="/quizzes/alphabets" element={<AlphabetQuizMap />} />
          <Route path="/quiz/alphabets/master" element={<AlphabetQuizMaster />} />
          <Route path="/quiz/numbers" element={<NumbersQuiz />} />
          <Route path="/quiz/alphabets/mod5" element={<AlphabetQuizFive />} />
          <Route path="/quiz/alphabets/mod4" element={<AlphabetQuizFour />} />
          <Route path="/quiz/alphabets/mod3" element={<AlphabetQuizThree />} />
          <Route path="/quiz/alphabets/mod2" element={<AlphabetQuizTwo />} />
          <Route path="/quiz/alphabets/mod1" element={<AlphabetQuizOne />} />
          <Route path="/learn/alphabets/mod5" element={<AlphabetModuleFive />} />
          <Route path="/learn/alphabets/mod4" element={<AlphabetModuleFour />} />
          <Route path="/learn/alphabets/mod3" element={<AlphabetModuleThree />} />
          <Route path="/learn/alphabets/mod2" element={<AlphabetModuleTwo />} />
          <Route path="/learn/alphabets/mod1" element={<AlphabetModuleOne />} />
          <Route path="/learn/alphabets" element={<AlphabetLevels />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/emotions" element={<Emotions />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;