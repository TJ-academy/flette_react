// src/pages/MyPwdEdit.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/mypage/mypwdedit.css";

function MyPwdEdit() {
  const navigate = useNavigate();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const isMatch = newPwd === confirmPwd;
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
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("비밀번호 업데이트 에러:", err);
      setStatusMessage("❌ 비밀번호 변경 실패: " + err.message);
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff", 
        padding: "16px",
      }}
    >
      <section className="pwd-edit-container">
        {/* 헤더 */}
        <div className="pwd-edit-header">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="back-btn"
          >
            ‹
          </button>
          <h2>비밀번호 재설정</h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="pwd-edit-form">
          <Field label="기존 비밀번호를 입력하세요.">
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="pwd-edit-input"
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
              className="pwd-edit-input"
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
              className="pwd-edit-input"
              placeholder="새 비밀번호 확인"
              required
              autoComplete="new-password"
            />
          </Field>

          {/* 상태 메시지 */}
          <div className="status-message">
            {statusMessage && (
              <span
                className={statusMessage.startsWith("✅") ? "success" : "error"}
              >
                {statusMessage}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="save-pwd-btn"
          >
            저장하기
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div className="pwd-edit-field">
      <div className="pwd-edit-label">{label}</div>
      {children}
    </div>
  );
}

export default MyPwdEdit;
