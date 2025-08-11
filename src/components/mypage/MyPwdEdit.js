// src/pages/MyPwdEdit.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/mypage/myinfoedit.css";

function MyPwdEdit() {
  const navigate = useNavigate();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const isMatch = newPwd === confirmPwd;

  // 비밀번호 8자 이상 조건 제거
  const canSubmit = currentPwd && isMatch && newPwd;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!canSubmit) {
      if (!isMatch) {
        setStatusMessage("❌ 비밀번호가 일치하지 않습니다.");
      } else {
        setStatusMessage("❌ 모든 필드를 채워주세요.");
      }
      return;
    }

    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      setStatusMessage("로그인 상태가 유효하지 않습니다.");
      return;
    }

    const updatedData = {
      currentPwd: currentPwd,
      newPwd: newPwd,
    };

    try {
      const response = await fetch(`/api/mypage/password/update/${loginId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setStatusMessage("✅ 비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => navigate(-1), 1500); // 1.5초 후 이전 페이지로 이동
    } catch (err) {
      console.error("비밀번호 업데이트 에러:", err);
      setStatusMessage("❌ 비밀번호 변경 실패: " + err.message);
    }
  };

  return (
    <main style={{ display: "grid", placeItems: "center", padding: "24px 16px" }}>
      <section
        style={{
          width: "min(560px, 92vw)",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18 }}
          >
            ‹
          </button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>비밀번호 재설정</h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <Field label="기존 비밀번호를 입력하세요.">
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              style={inputStyle}
              placeholder="현재 비밀번호"
              required
              autoComplete="current-password"
            />
          </Field>

          <Field label="새 비밀번호를 입력하세요.">
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              style={inputStyle}
              placeholder="새 비밀번호"
              required
              autoComplete="new-password"
            />
          </Field>

          <Field label="비밀번호를 다시 입력하세요.">
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              style={inputStyle}
              placeholder="새 비밀번호 확인"
              required
              autoComplete="new-password"
            />
          </Field>

          {/* 에러 메시지 */}
          <div style={{ minHeight: 18, marginTop: 6, marginBottom: 12, fontSize: 12 }}>
            {statusMessage && (
              <span style={{ color: statusMessage.startsWith('✅') ? 'green' : '#d33' }}>
                {statusMessage}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: 180,
              height: 40,
              borderRadius: 20,
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              opacity: canSubmit ? 1 : 0.6
            }}
          >
            저장하기
          </button>
        </form>
      </section>
    </main>
  );
}

// 작은 유틸 컴포넌트/스타일은 그대로 유지합니다.
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 6
};

export default MyPwdEdit;