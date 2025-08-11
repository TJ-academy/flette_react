// src/pages/MyPageMain.jsx
import React from "react";
import { Link } from "react-router-dom";

function MyPageMain() {
  return (
    <main style={{ padding: "24px 16px", textAlign: "center" }}>
      {/* 사용자 이름 */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>강한나래 님</span>
        <button
          type="button"
          aria-label="프로필 편집"
          onClick={() => alert("프로필 편집으로 이동")}
          style={{
            marginLeft: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 4
          }}
        >
          {/* 연필 아이콘 */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
              stroke="currentColor"
            />
            <path
              d="M14.06 4.94l3.75 3.75 1.77-1.77a1.5 1.5 0 0 0 0-2.12l-1.63-1.63a1.5 1.5 0 0 0-2.12 0l-1.77 1.77z"
              stroke="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* 3개 메뉴 박스 */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 8
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <StatItem to="/mypage/orders" label="주문내역" value={21} icon="📝" />
          <StatItem to="/mypage/reviews" label="리뷰" value={6} icon="💬" />
          <StatItem to="/mypage/qna" label="문의" value={6} icon="❓" />
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
        padding: 16
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </Link>
  );
}

export default MyPageMain;