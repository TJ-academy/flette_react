// Menu.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/menu.css';
import logo from '../../resources/images/flette_logo.png';

// App.js로부터 props를 받습니다.
function Menu({ isLoggedIn, loginName, userLevel, handleLogout }) {
  const navigate = useNavigate();

  const handleClientLogout = () => {
    // props로 받은 로그아웃 함수를 먼저 호출하여 App.js의 상태를 변경합니다.
    handleLogout();

    // 이제 서버에 로그아웃 요청을 보냅니다.
    fetch('/api/member/logout', {
      method: 'POST',
    })
    .then(() => {
      // 서버 로그아웃 성공 후 홈 페이지로 리디렉션합니다.
      navigate('/');
    })
    .catch((error) => {
      console.error('로그아웃 실패:', error);
    });
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo"><img src={logo} alt="플레트 로고" /></Link>
        <ul className="nav-links">
          <li><Link to="/shop">커스텀 꽃다발 제작</Link></li>
          <li><Link to="/survey/start">나와 어울리는 꽃 찾기</Link></li>
          <li><Link to="/">꽃 알아보기</Link></li>
          <li className="admin-menu-item">
            <Link to="/">관리자 기능</Link>
            {/* 관리자 레벨(10)일 때만 관리자 메뉴를 렌더링합니다. */}
            {userLevel === 10 && (
              <ul className="submenu">
                <li><Link to="/admin/member">회원 관리</Link></li>
                <li><Link to="/admin/flower">꽃 관리</Link></li>
                <li><Link to="/admin/order">주문 관리</Link></li>
                <li><Link to="/admin/question">문의 관리</Link></li>
              </ul>
            )}
          </li>
        </ul>
        <div className="user-actions">
          {/* props로 받은 isLoggedIn 상태에 따라 UI를 렌더링합니다. */}
           {isLoggedIn ? (
            <>
              <Link to="/mypage" className="user-name-link">{loginName} 님</Link>
              <button onClick={handleClientLogout} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/member/login" className="login-btn">로그인</Link>
              <Link to="/member/join" className="signup-btn">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Menu;