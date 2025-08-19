import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDetail.css"; // CSS 파일을 재사용

const pageStyles = `
  .cancel-page-container {
    padding: 40px 20px;
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    font-family: 'Inter', sans-serif;
  }
  .cancel-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #f77893;
    text-align: center;
    margin-bottom: 30px;
  }
  .cancel-section {
    border-top: 1px solid #e0e0e0;
    padding: 20px 0;
  }
  /* 첫 번째 섹션의 border-top 제거 */
  .cancel-section:first-of-type {
    border-top: none;
  }
  .cancel-section-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }
  .canceled-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #f2f2f2;
  }
  .item-details {
    flex-grow: 1;
  }
  .item-name {
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
  }
  .item-options {
    font-size: 0.9rem;
    color: #888;
  }
  /* 환불 사유 입력란 스타일 */
  .refund-reason-textarea {
    width: calc(100% - 20px);
    min-height: 120px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
  }
  /* 환불 계좌 입력란 스타일 */
  .bank-account-input-group {
    display: flex;
    gap: 10px;
  }
  .account-input {
    flex: 1;
    min-width: 120px;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
  }
  .owner-name-input {
    flex: 0.5;
  }
  /* 환불 금액 섹션 스타일 */
  .refund-amount-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-top: 1px solid #e0e0e0;
    margin-top: 20px; /* 입력 필드와의 간격 */
  }
  .refund-amount-label {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
  }
  .refund-amount-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f77893;
  }
  /* 버튼 그룹 스타일 */
  .refund-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }
  .cancel-button,
  .submit-refund-button {
    flex: 1;
    padding: 12px 25px;
    border: 1px solid #f77893;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .cancel-button {
    background-color: #ffffff;
    color: #f77893;
  }
  .cancel-button:hover {
    background-color: #fce4e8;
  }
  .submit-refund-button {
    background-color: #f77893;
    color: white;
  }
  .submit-refund-button:hover {
    background-color: #e56580;
  }
`;

function OrderRefund() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderCancelInfo, setOrderCancelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [refundReason, setRefundReason] = useState("");
  // 백엔드에서 은행명과 계좌번호를 분리하여 받기 위해 state 변수명을 bank와 account로 변경
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    const fetchCancelInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/refund/${orderId}/info`);
        setOrderCancelInfo(response.data);
      } catch (err) {
        console.error("환불 정보를 불러오는 데 실패했습니다.", err);
        setError("환불 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCancelInfo();
  }, [orderId]);

  const getFlowerOptionsString = (flowers) => {
    if (!flowers || flowers.length === 0) return "";
    return flowers.map(f => f.name).join(", ");
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('ko-KR').format(amount);
    }
    return amount;
  };

  const handleRefundSubmit = async () => {
    if (!refundReason) {
      alert("환불 사유를 입력해주세요.");
      return;
    }
    if (!account || !bank) {
      alert("환불 계좌 정보를 모두 입력해주세요.");
      return;
    }
    if(window.confirm("정말 환불 신청을 하시겠어요?")) {
    try {
      const refundData = {
        refundReason,
        bank,
        account,
      };

      // 프록시 설정에 맞게 수정: `/api/orders/refund/...`로 변경
      const response = await axios.patch(`/api/orders/refund/${orderId}`, refundData);
      
      alert(response.data);
      navigate("/mypage/order");
      
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("환불 신청 중 오류가 발생했습니다.");
      }
      console.error("환불 신청 실패:", err);
    }
    }
  };

  if (loading) {
    return <div className="cancel-page-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="cancel-page-container">{error}</div>;
  }

  if (!orderCancelInfo) {
    return <div className="cancel-page-container">주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <style>{pageStyles}</style>
      <div className="cancel-page-container">
        <h2 className="cancel-title">환불 신청</h2>

        <div className="cancel-section">
          <h3 className="cancel-section-title">환불 요청 상품 1개</h3>
          <div className="canceled-item">
            <img 
              src={`/img/product/${orderCancelInfo.imageName}`} 
              alt={orderCancelInfo.productName} 
              className="item-image" 
            />
            <div className="item-details">
              <div className="item-name">{orderCancelInfo.productName}</div>
              <div className="item-options">MAIN {getFlowerOptionsString(orderCancelInfo.mainFlowers)}</div>
              <div className="item-options">SUB {getFlowerOptionsString(orderCancelInfo.subFlowers)}</div>
              <div className="item-options">FOLIAGE {getFlowerOptionsString(orderCancelInfo.foliageFlowers)}</div>
            </div>
          </div>
        </div>

        <div className="cancel-section">
          <h3 className="cancel-section-title">환불을 원하는 자세한 사유를 적어주세요.</h3>
          <textarea
            className="refund-reason-textarea"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          ></textarea>
        </div>
        
        <div className="cancel-section">
          <h3 className="cancel-section-title">환불 받을 계좌를 입력해주세요.</h3>
          <div className="bank-account-input-group">
            <input
              type="text"
              className="account-input"
              placeholder="계좌번호 (1000-000-0000)"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
            <input
              type="text"
              className="account-input owner-name-input"
              placeholder="은행명"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            />
          </div>
        </div>

        <div className="refund-amount-section">
          <span className="refund-amount-label">환불 예정 금액</span>
          <span className="refund-amount-value">{formatCurrency(orderCancelInfo.totalMoney)}원</span>
        </div>
        
        <div className="refund-buttons">
          <button
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            className="submit-refund-button"
            onClick={handleRefundSubmit}
          >
            환불 신청
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderRefund;