import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/include/Menu';
import Footer from './components/include/Footer';
import Main from './components/Main';
import Login from './components/member/Login';
import Join from './components/member/Join';
import JoinNext from './components/member/JoinNext'; // JoinNext 컴포넌트 추가
import JoinFinish from './components/member/JoinFinish'; // JoinFinish 컴포넌트 추가

function App() {
  return (
    <Router>
      <Menu /> {/* Router 내부로 이동 */}
      
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/member/login" element={<Login />} />
        <Route path="/member/join" element={<Join />} />
        <Route path="/member/joinNext" element={<JoinNext />} /> {/* 경로 추가 */}
        <Route path="/member/joinFinish" element={<JoinFinish />} /> {/* 경로 추가 */}
      </Routes>

      <Footer /> {/* Router 내부로 이동 */}
    </Router>
  );
}

export default App;
