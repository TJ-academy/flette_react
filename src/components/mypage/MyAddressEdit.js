// src/pages/MyAddressEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/mypage/myaddressedit.css";

// Daum 우편번호 스크립트 동적 로드
const loadDaumPostcodeScript = () =>
  new Promise((resolve, reject) => {
    const existed = document.querySelector('script[src*="postcode.v2.js"]');
    if (existed) return resolve();
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Daum Postcode script load failed"));
    document.head.appendChild(script);
  });

export default function MyAddressEdit() {
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useState({
    zipcode: "",
    address1: "", // 기존 주소
    address2: "",
  });
  const [newAddress1, setNewAddress1] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loginId = sessionStorage.getItem("loginId");
    if (loginId) {
      fetch(`/api/mypage/member/${loginId}`)
        .then((r) => r.json())
        .then((d) => {
          setMemberInfo({
            zipcode: d.zipcode || "",
            address1: d.address1 || "",
            address2: d.address2 || "",
          });
        })
        .catch((e) => console.error("회원 정보 불러오기 실패:", e));
    }
    loadDaumPostcodeScript()
      .then(() => setIsScriptLoaded(true))
      .catch(console.error);
  }, []);

  const handlePostcodeSearch = () => {
    if (!(isScriptLoaded && window.daum?.Postcode)) {
      setStatusMessage("❌ 우편번호 검색 스크립트가 로드되지 않았습니다.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        const addr =
          data.userSelectedType === "R"
            ? data.roadAddress
            : data.jibunAddress;
        setZipcode(data.zonecode);
        setNewAddress1(addr);
      },
    }).open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      setStatusMessage("로그인 상태가 유효하지 않습니다.");
      return;
    }
    if (!zipcode || !newAddress1 || !memberInfo.address2.trim()) {
      setStatusMessage("❌ 주소 정보를 모두 입력해주세요.");
      return;
    }
    const updatedData = {
      zipcode,
      address1: newAddress1,
      address2: memberInfo.address2,
    };
    fetch(`/api/mypage/member/update/${loginId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) =>
        res.ok ? res.text() : res.text().then((t) => Promise.reject(new Error(t)))
      )
      .then(() => {
        setStatusMessage("✅ 주소가 성공적으로 변경되었습니다.");
        setTimeout(() => navigate(-1), 1200);
      })
      .catch((err) => {
        console.error("주소 업데이트 에러:", err);
        setStatusMessage("❌ 주소 변경 실패: " + err.message);
      });
  };

  return (
    <main style={{ display: "grid", placeItems: "center", padding: "24px 16px" }}>
      <section className="addr-edit-container">
        {/* 헤더 */}
        <div className="addr-edit-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            ‹
          </button>
          <h2>기본 주소 변경</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 기존 주소 */}
          <div className="addr-edit-field">
            <div className="addr-edit-label">기존 배송지</div>
            <div className="addr-edit-static">
              {memberInfo.address1 || "-"}
            </div>
          </div>

          {/* 신규 기본 주소 + 우편번호 검색 */}
          <div className="addr-edit-field">
            <div className="addr-edit-label">신규 배송지</div>
            <div className="addr-zipcode-row">
              <input
                type="text"
                className="addr-edit-input"
                placeholder="신규 기본 주소를 검색하세요."
                value={newAddress1}
                onChange={(e) => setNewAddress1(e.target.value)}
                readOnly
              />
              <button
                type="button"
                className="zipcode-btn"
                onClick={handlePostcodeSearch}
                disabled={!isScriptLoaded}
              >
                우편번호 검색
              </button>
            </div>
          </div>

          {/* 상세 주소 */}
          <div className="addr-edit-field">
            <div className="addr-edit-label">상세 주소</div>
            <input
              type="text"
              className="addr-edit-input"
              placeholder="상세 주소를 입력하세요."
              value={memberInfo.address2}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, address2: e.target.value })
              }
            />
          </div>

          {/* 상태 메시지 */}
          {statusMessage && (
            <div
              className={`addr-status-message ${
                statusMessage.startsWith("✅") ? "success" : "error"
              }`}
            >
              {statusMessage}
            </div>
          )}

          {/* 버튼 */}
          <div className="addr-edit-actions">
            <button
              type="button"
              className="addr-cancel-btn"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button type="submit" className="addr-save-btn">
              등록
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
