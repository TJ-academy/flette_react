import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/menu.css'; // 해당 경로에 CSS 파일 추가 (admin_menu.css)

function Menu() {
  const [currentCategory, setCurrentCategory] = useState(null); // 현재 카테고리 상태
  const userId = sessionStorage.getItem('user_id'); // sessionScope.user_id 대신 사용

  return (
    <nav className="navbar navbar-expand-lg custom-navbar-bg">
      <div className="container-fluid">
        <a className="navbar-brand logo" href="/">
          <img src="../../resources/images/설화수 로고.png" alt="설화수 로고" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${currentCategory === 'admin_member' ? 'active' : ''}`}
                to="#"
                id="memberDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                회원
              </Link>
              <ul className="dropdown-menu" aria-labelledby="memberDropdown">
                <li><Link className="dropdown-item" to="/admin/member_list.do">회원 관리</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${currentCategory === 'admin_legend' ? 'active' : ''}`}
                to="#"
                id="legendDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                설화
              </Link>
              <ul className="dropdown-menu" aria-labelledby="legendDropdown">
                <li><Link className="dropdown-item" to="/admin/legend_list.do">설화 관리</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${currentCategory === 'admin_reward' ? 'active' : ''}`}
                to="#"
                id="rewardDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                리워드
              </Link>
              <ul className="dropdown-menu" aria-labelledby="rewardDropdown">
                <li><Link className="dropdown-item" to="/admin/reward_list.do">리워드 관리</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${currentCategory === 'admin_goods' || currentCategory === 'admin_order' ? 'active' : ''}`}
                to="#"
                id="goodsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                상품
              </Link>
              <ul className="dropdown-menu" aria-labelledby="goodsDropdown">
                <li><Link className="dropdown-item" to="/admin/goods_list.do">상품 관리</Link></li>
                <li><Link className="dropdown-item" to="/admin/order_list.do">주문내역 관리</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${currentCategory === 'admin_badge' || currentCategory === 'admin_user_badge' ? 'active' : ''}`}
                to="#"
                id="badgeDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                명패
              </Link>
              <ul className="dropdown-menu" aria-labelledby="badgeDropdown">
                <li><Link className="dropdown-item" to="/admin/badge_list.do">명패 관리</Link></li>
                <li><Link className="dropdown-item" to="/admin/user_badge_list.do">명패 획득 관리</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${currentCategory === 'admin_donation' || currentCategory === 'admin_donation_contents' ? 'active' : ''}`}
                to="#"
                id="donationDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                기부
              </Link>
              <ul className="dropdown-menu" aria-labelledby="donationDropdown">
                <li><Link className="dropdown-item" to="/admin/donation_contents_list.do">기부 프로젝트 관리</Link></li>
                <li><Link className="dropdown-item" to="/admin/donation_list.do">기부 내역 조회</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${currentCategory === 'admin_statistics' ? 'active' : ''}`}
                to="#"
              >
                통계
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav user-nav-items">
            {userId ? (
              <li className="nav-item">
                <Link className="nav-link" to="/logout.do">로그아웃</Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login.do">로그인</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/join.do">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
