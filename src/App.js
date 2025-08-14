// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 공통 레이아웃
import Menu from './components/include/Menu';
import Footer from './components/include/Footer';

// 메인
import Main from './components/Main';

// 회원 관련
import Login from './components/member/Login';
import Join from './components/member/Join';
import JoinNext from './components/member/JoinNext';
import JoinFinish from './components/member/JoinFinish';

// 마이페이지
import MyPageMain from './components/mypage/MyPageMain';
import MyInfoEdit from './components/mypage/MyInfoEdit';
import MyPwdEdit from './components/mypage/MyPwdEdit';
import MyAddressEdit from './components/mypage/MyAddressEdit';
import OrderList from './components/mypage/OrderList';
import OrderDetail from './components/mypage/OrderDetail';
import OrderDelivery from './components/mypage/OrderDelivery';
import OrderReview from './components/mypage/OrderReview';
import MyReviewList from './components/mypage/MyReviewList';
import MyReviewWrite from './components/mypage/MyReviewWrite';
import MyReviewDetail from './components/mypage/MyReviewDetail';
import MyQuestionList from './components/mypage/MyQuestionList';
import MyQuestionDetail from './components/mypage/MyQuestionDetail';

//장바구니
import CartList from './components/cart/CartList';

// 설문조사
import StartSurvey from './components/mbti_flower/StartSurvey';
import FirstSurvey from './components/mbti_flower/FirstSurvey';

// 꽃 관련
import { FlowerList } from './components/flower/FlowerList';
import FlowerDetail from './components/flower/FlowerDetail';

// 쇼핑몰 & 관리자
import ShopApp from './ShopApp';
import MemberAdmin from './components/admin/MemberAdmin';
import FlowerAdmin from './components/admin/FlowerAdmin';
import OrderAdmin from './components/admin/OrderAdmin';
import QuestionAdmin from './components/admin/QuestionAdmin';
import ReviewsIndex from './components/shop/ReviewsIndex';
import MainAdmin from './components/admin/MainAdmin'; 

// 결제
import PaymentTestPage from './PaymentTestPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [userLevel, setUserLevel] = useState(1); // 관리자 레벨 상태

  // 로그인 처리 (레벨 포함)
  const handleLogin = (name, level) => {
    setIsLoggedIn(true);
    setLoginName(name);
    setUserLevel(level);
    sessionStorage.setItem('userLevel', level);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    sessionStorage.removeItem('loginId');
    sessionStorage.removeItem('loginName');
    sessionStorage.removeItem('userLevel');
    setIsLoggedIn(false);
    setLoginName('');
    setUserLevel(1);
  };

  // 초기 세션 확인
  useEffect(() => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const storedLoginName = sessionStorage.getItem('loginName');
    const storedUserLevel = sessionStorage.getItem('userLevel');

    if (storedLoginId) {
      setIsLoggedIn(true);
      setLoginName(storedLoginName);
      setUserLevel(storedUserLevel ? parseInt(storedUserLevel, 10) : 1);
    } else {
      setIsLoggedIn(false);
      setLoginName('');
      setUserLevel(1);
    }
  }, []);

  return (
    <Router>
      <Menu
        isLoggedIn={isLoggedIn}
        loginName={loginName}
        userLevel={userLevel}
        handleLogout={handleLogout}
      />
      <Routes>
        {/* 메인 */}
        <Route path="/" element={<Main />} />

        {/* 회원 */}
        <Route path="/member/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/member/join" element={<Join />} />
        <Route path="/member/joinNext" element={<JoinNext />} />
        <Route path="/member/joinFinish" element={<JoinFinish />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyPageMain />} />
        <Route path="/mypage/edit" element={<MyInfoEdit />} />
        <Route path="/mypage/pwd_edit" element={<MyPwdEdit />} />
        <Route path="/mypage/address_edit" element={<MyAddressEdit />} />
        <Route path="/mypage/order" element={<OrderList />} />
        <Route path="/mypage/order/detail/:id" element={<OrderDetail />} />
        <Route path="/mypage/order/delivery/:id" element={<OrderDelivery />} />
        <Route path="/mypage/order/review_write/:id" element={<OrderReview />} />
        <Route path="/mypage/review" element={<MyReviewList />} />
        <Route path="/mypage/reviews/write/:purchaseId" element={<MyReviewWrite />} />
        <Route path="/mypage/review/detail/:id" element={<MyReviewDetail />} />
        <Route path="/mypage/question" element={<MyQuestionList />} />
        <Route path="/mypage/question/detail/:id" element={<MyQuestionDetail />} />

        {/* 리뷰 */}
        <Route path="/reviews" element={<ReviewsIndex />} />

        {/* 설문조사 */}
        <Route path="/survey/start" element={<StartSurvey />} />
        <Route path="/survey/first" element={<FirstSurvey />} />

        {/* 꽃 */}
        <Route path="/flower/list" element={<FlowerList />} />
        <Route path="/flower/:id" element={<FlowerDetail />} />

        {/* 쇼핑몰 */}
        <Route path="/shop/*" element={<ShopApp />} />

        {/* 장바구니 */}
        <Route path="/cart" element={<CartList />} />

        {/* 관리자 */}
        <Route path="/admin/member" element={<MemberAdmin />} />
        <Route path="/admin/flower" element={<FlowerAdmin />} />
        <Route path="/admin/order" element={<OrderAdmin />} />
        <Route path="/admin/question" element={<QuestionAdmin />} />
        <Route path="/admin" element={<MainAdmin />} />
        <Route path="/" element={<Main />} />
        <Route path="/survey/start" element={<StartSurvey />} />
        <Route path="/admin" element={<MainAdmin />} />

        {/* 결제 테스트 */}
        <Route path="/payment" element={<PaymentTestPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;