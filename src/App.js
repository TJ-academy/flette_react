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

import ShopApp from './ShopApp';

import MemberAdmin from './components/admin/MemberAdmin';
import FlowerAdmin from './components/admin/FlowerAdmin';
import OrderAdmin from './components/admin/OrderAdmin';
import QuestionAdmin from './components/admin/QuestionAdmin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState('');
  // 관리자 레벨 상태 추가
  const [userLevel, setUserLevel] = useState(1); 

  const handleLogin = (name, level) => {
    setIsLoggedIn(true);
    setLoginName(name);
    // 로그인 시 레벨 상태 업데이트
    setUserLevel(level);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loginId');
    sessionStorage.removeItem('loginName');
    // 로그아웃 시 레벨 상태 초기화
    sessionStorage.removeItem('userLevel');
    setIsLoggedIn(false);
    setLoginName('');
    setUserLevel(1);
  };

  useEffect(() => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const storedLoginName = sessionStorage.getItem('loginName');
    // 세션 스토리지에서 레벨 정보도 불러옴
    const storedUserLevel = sessionStorage.getItem('userLevel');
    
    if (storedLoginId) {
      setIsLoggedIn(true);
      setLoginName(storedLoginName);
      // 저장된 레벨이 있으면 상태에 적용
      setUserLevel(storedUserLevel ? parseInt(storedUserLevel, 10) : 1);
    } else {
      setIsLoggedIn(false);
      setLoginName('');
      setUserLevel(1);
    }
  }, []);

  return (
    <Router>
      {/* Menu 컴포넌트에 userLevel props 전달 */}
      <Menu isLoggedIn={isLoggedIn} loginName={loginName} userLevel={userLevel} handleLogout={handleLogout} />
      <Routes>
        {/* Login 컴포넌트에 handleLogin 함수를 전달 */}
        <Route path="/member/login" element={<Login handleLogin={handleLogin} />} />
      
        <Route path="/" element={<Main />} />
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
        

        <Route path="/shop/*" element={<ShopApp />} />

        <Route path="/admin/member" element={<MemberAdmin />} />
        <Route path="/admin/flower" element={<FlowerAdmin />} />
        <Route path="/admin/order" element={<OrderAdmin />} />
        <Route path="/admin/question" element={<QuestionAdmin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;