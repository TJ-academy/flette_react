// src/pages/MyPageMain.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate를 import 합니다.

function MyPageMain() {
  const [loginName, setLoginName] = useState("");
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.

  useEffect(() => {
    const storedLoginName = sessionStorage.getItem("loginName");
    if (storedLoginName) {
      setLoginName(storedLoginName);
    }
  }, []);

  // 이 함수는 프로필 편집 버튼이 클릭될 때 호출됩니다.
  const handleEditClick = () => {
    navigate("/mypage/edit");
  };

  return (
    <main style={{ padding: "24px 16px", textAlign: "center" }}>
      {/* 사용자 이름 */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>{loginName} 님</span>
        <button
          type="button"
          aria-label="프로필 편집"
          onClick={handleEditClick} // onClick 이벤트를 handleEditClick 함수로 변경합니다.
          style={{
            marginLeft: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <span role="img" aria-label="pencil icon">📝</span>
        </button>
      </div>

      {/* 3개 메뉴 박스 */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <StatItem to="/mypage/order" label="주문내역" value={21} icon="📝" />
          <StatItem to="/mypage/review" label="리뷰" value={6} icon="💬" />
          <StatItem to="/mypage/question" label="문의" value={6} icon="❓" />
        </div>
      </div>
    </main>
  );
}

function StatItem({ to, label, value, icon }) {
  return (
    <Link
      to={to}
      style={{
        flex: 1,
        textDecoration: "none",
        color: "inherit",
        display: "grid",
        placeItems: "center",
        gap: 4,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </Link>
  );
}

export default MyPageMain;