import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/menu.css';
import logo from '../../resources/images/flette_logo.png';

function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState(''); // 사용자 이름 상태 추가
  const navigate = useNavigate(); // useNavigate 추가

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

  const handleLogout = () => {
    // 1. 클라이언트에서 세션 데이터 삭제
    sessionStorage.removeItem('loginId');
    sessionStorage.removeItem('loginName');

    // 2. 서버로 로그아웃 요청
    fetch('/api/member/logout', {
      method: 'POST',
    })
      .then(() => {
        // 3. 로그아웃 후 리다이렉트
        setIsLoggedIn(false);
        setLoginName('');
        navigate('/'); // 홈 페이지로 이동
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
          <li><Link to="/">커스텀 꽃다발 제작</Link></li>
          <li><Link to="/">나만 아름다운 꽃 찾기</Link></li>
          <li><Link to="/">꽃 알아보기</Link></li>
        </ul>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <span>안녕하세요, {loginName} 님</span>
              <button onClick={handleLogout} className="logout-btn">로그아웃</button>
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
