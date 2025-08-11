// App.js
import React, { useState, useEffect } from 'react'; // useState와 useEffect를 import 합니다.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/include/Menu';
import Footer from './components/include/Footer';
import Main from './components/Main';
import Login from './components/member/Login';
import Join from './components/member/Join';
import JoinNext from './components/member/JoinNext';
import JoinFinish from './components/member/JoinFinish';
import MyPageMain from './components/mypage/MyPageMain';
import MyInfoEdit from './components/mypage/MyInfoEdit';
import MyPwdEdit from './components/mypage/MyPwdEdit';
import MyAddressEdit from './components/mypage/MyAddressEdit';
import OrderList from './components/mypage/OrderList';
import OrderDetail from './components/mypage/OrderDetail';
import OrderDelivery from './components/mypage/OrderDelivery';
import OrderReview from './components/mypage/OrderReview';
import MyReviewList from './components/mypage/MyReviewList';
import MyReviewDetail from './components/mypage/MyReviewDetail';
import MyQuestionList from './components/mypage/MyQuestionList';
import MyQuestionDetail from './components/mypage/MyQuestionDetail';

//설문조사
import StartSurvey from './components/mbti_flower/StartSurvey';
import FirstSurvey from './components/mbti_flower/FirstSurvey';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState('');

  // This function will be passed to the Login component.
  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setLoginName(name);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loginId');
    sessionStorage.removeItem('loginName');
    setIsLoggedIn(false);
    setLoginName('');
  };

  // Check for session data on initial load
  useEffect(() => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const storedLoginName = sessionStorage.getItem('loginName');
    
    if (storedLoginId) {
      setIsLoggedIn(true);
      setLoginName(storedLoginName);
    } else {
      setIsLoggedIn(false);
      setLoginName('');
    }
  }, []);

  return (
    <Router>
      <Menu isLoggedIn={isLoggedIn} loginName={loginName} handleLogout={handleLogout} />
      <Routes>
        {/* Pass the handleLogin function to the Login component */}
        

        <Route path="/" element={<Main />} />
        {/* 로그인 컴포넌트는 로그인 상태를 직접 변경하지 않습니다. sessionStorage만 조작합니다. */}
        <Route path="/member/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/member/join" element={<Join />} />
        <Route path="/member/joinNext" element={<JoinNext />} />
        <Route path="/member/joinFinish" element={<JoinFinish />} />
        <Route path="/mypage" element={<MyPageMain />} />
        <Route path="/mypage/edit" element={<MyInfoEdit />} />
        <Route path="/mypage/pwd_edit" element={<MyPwdEdit />} />
        <Route path="/mypage/address_edit" element={<MyAddressEdit />} />
        <Route path="/mypage/order" element={<OrderList />} />
        <Route path="/mypage/order/detail/:id" element={<OrderDetail />} />
        <Route path="/mypage/order/delivery/:id" element={<OrderDelivery />} />
        <Route path="/mypage/order/review_write/:id" element={<OrderReview />} />
        <Route path="/mypage/review" element={<MyReviewList />} />
        <Route path="/mypage/review/detail/:id" element={<MyReviewDetail />} />
        <Route path="/mypage/question" element={<MyQuestionList />} />
        <Route path="/mypage/question/detail/:id" element={<MyQuestionDetail />} />

        <Route path="/survey/start" element={<StartSurvey/>} />
        <Route path="/survey/first" element={<FirstSurvey/>} />
        
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;