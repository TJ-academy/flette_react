// src/pages/MyAddressEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/mypage/myinfoedit.css";

// Daum 우편번호 스크립트를 동적으로 로드하는 함수
const loadDaumPostcodeScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Daum Postcode script load failed"));
    document.head.appendChild(script);
  });
};

function MyAddressEdit() {
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useState({
    zipcode: "",
    address1: "",
    address2: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // 컴포넌트 로드 시 회원 정보와 우편번호 스크립트 로드
    const loginId = sessionStorage.getItem("loginId");
    if (loginId) {
      fetch(`/api/mypage/member/${loginId}`)
        .then((response) => response.json())
        .then((data) => {
          setMemberInfo({
            zipcode: data.zipcode || "", // null 값 처리
            address1: data.address1 || "",
            address2: data.address2 || "",
          });
        })
        .catch((error) => console.error("회원 정보 불러오기 실패:", error));
    }
    
    // Daum 우편번호 스크립트 로드
    loadDaumPostcodeScript().then(() => {
      setIsScriptLoaded(true);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  const handlePostcodeSearch = () => {
    if (isScriptLoaded && window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          
          setMemberInfo((prevInfo) => ({
            ...prevInfo,
            zipcode: data.zonecode,
            address1: addr,
          }));
        },
      }).open();
    } else {
      setStatusMessage("❌ 우편번호 검색 스크립트가 로드되지 않았습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      setStatusMessage("로그인 상태가 유효하지 않습니다.");
      return;
    }

    const updatedData = {
      zipcode: memberInfo.zipcode,
      address1: memberInfo.address1,
      address2: memberInfo.address2,
    };
    
    // 모든 필드가 비어있지 않은지 확인
    if (!updatedData.zipcode || !updatedData.address1 || !updatedData.address2) {
      setStatusMessage("❌ 주소 정보를 모두 입력해주세요.");
      return;
    }

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
        setStatusMessage("✅ 주소가 성공적으로 변경되었습니다.");
        setTimeout(() => navigate(-1), 1500); // 1.5초 후 이전 페이지로 이동
      })
      .catch((error) => {
        console.error("주소 업데이트 에러:", error);
        setStatusMessage("❌ 주소 변경 실패: " + error.message);
      });
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
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ‹
          </button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>기본 주소 변경</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 우편번호 */}
          <Field label="우편번호">
            <input
              type="text"
              value={memberInfo.zipcode}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, zipcode: e.target.value })
              }
              style={{ ...inputStyle, width: "calc(100% - 110px)", marginRight: 10 }}
              placeholder="우편번호"
              required
              readOnly
            />
            <button
              type="button"
              onClick={handlePostcodeSearch}
              style={{ ...buttonStyle, width: 100 }}
              disabled={!isScriptLoaded}
            >
              우편번호 찾기
            </button>
          </Field>

          {/* 기본 주소 */}
          <Field label="기본 주소">
            <input
              type="text"
              value={memberInfo.address1}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, address1: e.target.value })
              }
              style={inputStyle}
              placeholder="기본 주소"
              required
              readOnly
            />
          </Field>

          {/* 상세 주소 */}
          <Field label="상세 주소">
            <input
              type="text"
              value={memberInfo.address2}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, address2: e.target.value })
              }
              style={inputStyle}
              placeholder="상세 주소"
              required
            />
          </Field>

          {/* 상태 메시지 */}
          {statusMessage && (
            <div style={{ marginTop: 12, textAlign: "center", color: statusMessage.startsWith('✅') ? 'green' : 'red' }}>
              {statusMessage}
            </div>
          )}

          {/* 제출 버튼 */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={cancelButtonStyle}
            >
              취소
            </button>
            <button type="submit" style={submitButtonStyle}>
              등록
            </button>
          </div>
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
  borderRadius: 6,
};

const buttonStyle = {
  background: "#f3f3f3",
  padding: "8px 16px",
  border: "1px solid #ddd",
  borderRadius: 6,
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "10px 20px",
  border: "none",
  backgroundColor: "#f3f3f3",
  color: "#333",
  borderRadius: 6,
  cursor: "pointer",
};

const submitButtonStyle = {
  padding: "10px 20px",
  border: "none",
  backgroundColor: "#f76c6c",
  color: "#fff",
  borderRadius: 6,
  cursor: "pointer",
};

export default MyAddressEdit;