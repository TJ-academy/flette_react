// src/pages/MyInfoEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/mypage/myinfoedit.css";

export default function MyInfoEdit() {
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useState({
    name: "",
    userId: "",
    address: "",
    phone: "",
    zipcode: "",
    address1: "",
    address2: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  // 컴포넌트 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const loginId = sessionStorage.getItem("loginId");
    if (loginId) {
      fetch(`/api/mypage/member/${loginId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("네트워크 응답이 올바르지 않습니다.");
          }
          return response.json();
        })
        .then((data) => {
          setMemberInfo({
            name: data.username,
            userId: data.userid,
            address: `${data.address1} ${data.address2}`,
            phone: data.tel,
            zipcode: data.zipcode,
            address1: data.address1,
            address2: data.address2,
          });
        })
        .catch((error) => console.error("회원 정보 불러오기 실패:", error));
    }
  }, []);

  // API 호출: 이름, 주소, 핸드폰 번호 저장
  const handleUpdate = () => {
    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      setStatusMessage("로그인 상태가 유효하지 않습니다.");
      return;
    }

    const updatedData = {
      username: memberInfo.name,
      address1: memberInfo.address1,
      address2: memberInfo.address2,
      tel: memberInfo.phone,
    };

    fetch(`/api/mypage/member/update/${loginId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.text();
      })
      .then(() => {
        setStatusMessage("✅ 성공적으로 수정되었습니다.");
      })
      .catch((error) => {
        console.error("업데이트 에러:", error);
        setStatusMessage("❌ 수정 실패: " + error.message);
      });
  };

  return (
    <main style={{ display: "grid", placeItems: "center", padding: "24px 16px" }}>
      <section className="myinfo-container">
        {/* 헤더 */}
        <div className="myinfo-header" style={{ justifyContent: 'flex-start' }}>
          <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기" className="back-btn">
            ‹
          </button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>개인 정보 수정</h2>
        </div>

        {/* 이름 */}
        <Row>
          <Label>이름</Label>
          <input
            type="text"
            value={memberInfo.name}
            onChange={(e) => setMemberInfo({ ...memberInfo, name: e.target.value })}
            className="info-input"
            placeholder="이름"
          />
        </Row>

        {/* 아이디(읽기전용) */}
        <Row>
          <Label>아이디</Label>
          <input type="text" value={memberInfo.userId} readOnly className="info-input" />
        </Row>

        {/* 비밀번호 재설정 (버튼으로 변경) */}
        <NavRow
          label="비밀번호 재설정"
          onClick={() => navigate("/mypage/pwd_edit")}
        />

        {/* 주소 (버튼으로 변경) */}
        <NavRow
          label="주소"
          onClick={() => navigate("/mypage/address_edit")}
        />
        
        {/* 핸드폰 번호 */}
        <Row>
          <Label>핸드폰 번호</Label>
          <input
            type="text"
            value={memberInfo.phone}
            onChange={(e) => setMemberInfo({ ...memberInfo, phone: e.target.value })}
            className="info-input"
            placeholder="010-0000-0000"
          />
        </Row>

        {/* 하단 - 전체 수정 및 회원 탈퇴 버튼 */}
        {statusMessage && <div style={{ marginTop: 24, textAlign: "center", color: statusMessage.startsWith('✅') ? 'green' : 'red' }}>{statusMessage}</div>}
        
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button type="button" onClick={handleUpdate} className="save-btn">
            정보 수정
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button type="button" className="text-btn" onClick={() => alert("회원 탈퇴 진행")}>
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}

// 작은 유틸 컴포넌트들은 그대로 유지합니다.
function Row({ children }) {
  return <div className="info-row">{children}</div>;
}

function Label({ children, style }) {
  return <div className="info-label" style={style}>{children}</div>;
}

// 기존 ClickableRow를 대신할 새로운 컴포넌트 (레이블 + 이동 버튼)
function NavRow({ label, onClick }) {
    return (
        <div className="info-row clickable" onClick={onClick} style={{ cursor: 'pointer' }}>
            <Label>{label}</Label>
            {/* 이 버튼을 눌렀을 때만 이동하게 수정 */}
            <button type="button" aria-label="이동" className="nav-arrow-btn">
                ›
            </button>
        </div>
    );
}