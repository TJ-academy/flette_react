// Menu.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/menu.css';
import logo from '../../resources/images/flette_logo.png';

// App.js로부터 props를 받습니다.
function Menu({ isLoggedIn, loginName, handleLogout }) {
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
        </ul>
        <div className="user-actions">
          {/* props로 받은 isLoggedIn 상태에 따라 UI를 렌더링합니다. */}
          {isLoggedIn ? (
            <>
              {/* === 변경된 부분 === */}
              {/* loginName을 클릭하면 '/mypage'로 이동하도록 <Link> 컴포넌트로 감쌌습니다. */}
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
