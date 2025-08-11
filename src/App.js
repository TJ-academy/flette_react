import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/include/Menu';
import Footer from './components/include/Footer';
import Main from './components/Main';

import Login from './components/member/Login';
import Join from './components/member/Join';
import JoinNext from './components/member/JoinNext'; // JoinNext 컴포넌트 추가
import JoinFinish from './components/member/JoinFinish'; // JoinFinish 컴포넌트 추가

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
         
      </Routes>

      <Footer /> {/* Router 내부로 이동 */}
    </Router>
  );
}

export default App;
