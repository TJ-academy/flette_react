import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/menu.css';
import logo from '../../resources/images/flette_logo.png';

function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState(''); // 사용자 이름 상태 추가

  useEffect(() => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const storedLoginName = sessionStorage.getItem('loginName');

    if (storedLoginId) {
      setIsLoggedIn(true);
      setLoginName(storedLoginName); // 사용자 이름 상태 업데이트
    } else {
      setIsLoggedIn(false);
      setLoginName('');
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo"><img src={logo} alt="플레트 로고" /></Link>

        <ul className="nav-links">
          <li><Link to="/">커스텀 꽃다발 제작</Link></li>
          <li><Link to="/">나만 아름다운 꽃 찾기</Link></li>
          <li><Link to="/">꽃 알아보기</Link></li>
        </ul>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <span>안녕하세요, {loginName} 님</span>
              <Link to="/member/logout" className="logout-btn">로그아웃</Link>
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