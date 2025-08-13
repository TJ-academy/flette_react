// src/components/include/Menu.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/menu.css';
import logo from '../../resources/images/flette_logo.png';
import cartIcon from '../../resources/images/cart.png';
import userIcon from '../../resources/images/user.png';

function Menu({ isLoggedIn, loginName, userLevel, handleLogout }) {
  const navigate = useNavigate();

  const handleClientLogout = () => {
    handleLogout();
    fetch('/api/member/logout', { method: 'POST' })
      .then(() => navigate('/'))
      .catch((e) => console.error('로그아웃 실패:', e));
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* 왼쪽 로고 */}
        <Link to="/" className="logo">
          <img src={logo} alt="Flette 로고" />
        </Link>

        {/* 가운데 메뉴 */}
        <ul className="nav-links">
          <li><Link to="/shop">커스텀 꽃다발 제작</Link></li>
          <li><Link to="/survey/start">나와 어울리는 꽃 찾기</Link></li>
          <li><Link to="/flower/list">꽃 알아보기</Link></li>

          {userLevel === 10 && (
            <li className="admin-menu-item">
              <Link to="/">관리자 기능</Link>
              <ul className="submenu">
                <li><Link to="/admin/member">회원 관리</Link></li>
                <li><Link to="/admin/flower">꽃 관리</Link></li>
                <li><Link to="/admin/order">주문 관리</Link></li>
                <li><Link to="/admin/question">문의 관리</Link></li>
              </ul>
            </li>
          )}
        </ul>

        {/* 오른쪽 유저 영역 */}
        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="icon-btn" aria-label="마이페이지">
                <img src={userIcon} alt="마이페이지" className="icon-img" />
              </Link>
              <Link to="/cart" className="icon-btn" aria-label="장바구니">
                <img src={cartIcon} alt="장바구니" className="icon-img" />
              </Link>
              <span className="user-name strong">{loginName} 님</span>
              <button onClick={handleClientLogout} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <Link to="/member/login" className="login-btn">로그인</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Menu;
