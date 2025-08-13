// src/components/mypage/MyPageMain.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/mypage/mypage.css";

// 이미지 불러오기
import editIcon from "../../resources/images/edit.png";
import listIcon from "../../resources/images/list.png";
import reviewIcon from "../../resources/images/review.png";
import qnaIcon from "../../resources/images/qna.png";

function MyPageMain() {
  const [loginName, setLoginName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedLoginName = sessionStorage.getItem("loginName");
    if (storedLoginName) {
      setLoginName(storedLoginName);
    }
  }, []);

  const handleEditClick = () => {
    navigate("/mypage/edit");
  };

  return (
    <main style={{ padding: "24px 16px", textAlign: "center" }}>
      <br></br>
      <br></br>
      <div style={{ marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#F2778C" }}>
          {loginName} 님
        </span>
        <button
          type="button"
          aria-label="프로필 편집"
          onClick={handleEditClick}
          style={{
            marginLeft: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <img src={editIcon} alt="프로필 편집" style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* 3개 메뉴 박스 */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          border: "2px solid #F2778C",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <StatItem to="/mypage/order" label="주문내역" value={21} icon={listIcon} />
          <StatItem to="/mypage/review" label="리뷰" value={6} icon={reviewIcon} />
          <StatItem to="/mypage/question" label="문의" value={6} icon={qnaIcon} />
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
    </main>
  );
}

function StatItem({ to, label, value, icon }) {
  return (
    <Link to={to} className="stat-item">
      <img src={icon} alt={label} style={{ height: 50 }} />
      <div style={{ fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{value}</div>
    </Link>
  );
}

export default MyPageMain;
