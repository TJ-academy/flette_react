import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// CSS for the modal and component display
const styles = `
  .orderdetail-body {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    width: 100%;
  }

  .orderdetail-text {
    flex-grow: 1;
  }

  .review-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 10px;
  }

  .review-button {
    background-color: #f77893;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .review-button:hover {
    background-color: #e56580;
  }

  .orderdetail-item {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 15px;
  }

  .orderdetail-status {
    text-align: right;
    margin-bottom: 10px;
  }

  .status-label {
    background-color: #f77893;
    color: white;
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
  }

  .orderdetail-thumb {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
  }

  .orderdetail-name {
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;
  }

  .orderdetail-price {
    color: #f77893;
    font-weight: bold;
    margin-top: 5px;
  }
  
  /* The rest of your styles from the original code */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 320px;
    font-family: 'Inter', sans-serif;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
  }
  .modal-message {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 24px;
  }
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
  .modal-button {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }
  .modal-button.confirm {
    background-color: #f77893;
    color: white;
  }
  .modal-button.confirm:hover {
    background-color: #e56580;
  }
  .modal-button.cancel {
    background-color: #f2f2f2;
    color: #666;
  }
  .modal-button.cancel:hover {
    background-color: #e0e0e0;
  }
  .orderdetail-components {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #555;
    border-top: 1px solid #e0e0e0;
    padding-top: 15px;
  }
  .orderdetail-components-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .orderdetail-components ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    max-height: 0;
  }
  .orderdetail-components ul.open {
    max-height: 500px;
  }
  .toggle-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }
  .component-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .component-type-name strong {
    font-weight: bold;
    margin-right: 5px;
  }
  .component-price {
    color: #f77893;
    font-weight: bold;
  }
  .orderdetail-container {
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 15px;
  }
`;

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching user and order data
    const fetchUserDataAndOrder = async () => {
        try {
            // Simulate user info fetch
            const userResponse = { data: { username: "강한나래", tel: "010-1234-5678" } };
            setCustomerName(userResponse.data.username);
            setPhoneNumber(userResponse.data.tel);

            // Simulate order detail fetch
            const mockOrderData = {
                "id": "123456789",
                "impUid": "imp_123456789",
                "orderDate": "2023-10-27T10:00:00Z",
                "status": "구매확정",
                "totalMoney": 50000,
                "orderAddress": "서울시 종로구 혜화동 15-9, 301호",
                "details": [
                    {
                        "productName": "커스텀 꽃다발 (중)",
                        "imageName": "bouquet_medium.png",
                        "money": 42300,
                        "bouquetCode": "BOUQ1",
                        "hasReview": false,
                        "components": [
                            { "type": "MAIN", "name": "장미", "addPrice": 0 },
                            { "type": "SUB", "name": "안개꽃", "addPrice": 1000 },
                            { "type": "WRAPPING", "name": "크라프트지", "addPrice": 0 }
                        ]
                    },
                    {
                        "productName": "커스텀 꽃다발 (대)",
                        "imageName": "bouquet_large.png",
                        "money": 52300,
                        "bouquetCode": "BOUQ2",
                        "hasReview": true,
                        "components": [
                            { "type": "MAIN", "name": "해바라기", "addPrice": 0 },
                            { "type": "SUB", "name": "데이지", "addPrice": 2000 },
                            { "type": "WRAPPING", "name": "투명 포장", "addPrice": 0 }
                        ]
                    }
                ]
            };
            setOrderDetail(mockOrderData);
        } catch (err) {
            console.error("주문 상세 정보를 불러오는 데 실패했습니다.", err);
            setError("주문 상세 정보를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    fetchUserDataAndOrder();
  }, [id]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      // await axios.patch(`/api/orders/cancel/${id}`);
      setShowCancelModal(false);
      navigate(`/orders/cancel/${id}`);
    } catch (err) {
      console.error("주문 취소 실패:", err);
      setShowCancelModal(false);
    }
  };

  const handleRefundClick = () => {
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async () => {
    try {
      setShowRefundModal(false);
      navigate(`/orders/refund/${id}`);
    } catch (err) {
      console.error("환불 요청 실패:", err);
      setShowRefundModal(false);
    }
  };

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      // await axios.patch(`/api/orders/confirm/${id}`);
      setShowConfirmModal(false);
      window.location.reload();
    } catch (err) {
      console.error("구매 확정 실패:", err);
      setShowConfirmModal(false);
    }
  };

  const formatOrderDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\. /g, '.').replace(/\./g, '. ').replace(/,/, '');
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString() + "원" : "0원";
  };
  
  const getComponentTypeLabel = (type) => {
    switch (type) {
      case "MAIN": return "MAIN";
      case "SUB": return "SUB";
      case "FOLIAGE": return "FOLIAGE";
      case "ADDITIONAL": return "ADDITIONAL";
      case "WRAPPING": return "WRAPPING";
      default: return type;
    }
  };

  const toggleComponents = () => {
    setIsComponentsOpen(!isComponentsOpen);
  };

  if (loading) {
    return <div className="orderdetail">로딩 중...</div>;
  }

  if (error) {
    return <div className="orderdetail error-message">{error}</div>;
  }

  if (!orderDetail) {
    return <div className="orderdetail">주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="orderdetail">
        <h2 className="orderdetail-title">주문상세</h2>

        {/* Order Number / Date Box */}
        <div className="orderdetail-container">
          <p>주문번호 {orderDetail.impUid}</p>
          <p>결제 날짜: {formatOrderDate(orderDetail.orderDate)}</p>
        </div>

        {/* Product List Box */}
        <div className="orderdetail-container">
          {orderDetail.details.map((item, idx) => (
            <div className="orderdetail-item" key={idx}>
              <div className="orderdetail-status">
                <span className="status-label">{orderDetail.status}</span>
              </div>
              <div className="orderdetail-body">
                <img 
                  className="orderdetail-thumb" 
                  src={`https://placehold.co/80x80/e2e8f0/4a5568?text=${item.productName.substring(0, 3)}`} 
                  alt={item.productName} 
                />
                <div className="orderdetail-text">
                  <div className="orderdetail-name">{item.productName}</div>
                  <div className="orderdetail-price">{formatPrice(item.money)}</div>
                  <div className="orderdetail-components">
                    <div className="orderdetail-components-header" onClick={toggleComponents}>
                      <span>부케 구성</span>
                      <span className={`toggle-arrow ${isComponentsOpen ? 'rotated' : ''}`}>&#9660;</span>
                    </div>
                    {item.components && (
                      <ul className={isComponentsOpen ? 'open' : ''}>
                        {item.components.map((component, compIdx) => (
                          <li key={compIdx} className="component-item">
                            <span className="component-type-name">
                              <strong>{getComponentTypeLabel(component.type)}</strong> {component.name}
                            </span>
                            {component.addPrice > 0 && (
                              <span className="component-price">+{formatPrice(component.addPrice)}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {/* Review button for each item, centered */}
              {orderDetail.status === "구매확정" && !item.hasReview && (
                <div className="review-button-container">
                  <button
                    className="review-button"
                    onClick={() => navigate(`/mypage/reviews/write/${item.bouquetCode}`)}
                  >
                    리뷰 쓰기
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Orderer Info Box */}
        <div className="orderdetail-container">
          <p>
            주문자 정보 | <strong>{customerName || orderDetail.userid || "알 수 없음"}</strong>{" "}
            {phoneNumber || ""}
          </p>
          <p>
            결제 정보<br />
            {formatPrice(orderDetail.totalMoney)}
          </p>
          <p>
            배송 주소<br />
            {orderDetail.orderAddress || "주소 정보 없음"}
          </p>
        </div>
      </div>

      {/* Order Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">주문을 취소할까요?</h3>
            <p className="modal-message">'확인'을 누르시면 주문이 취소됩니다.</p>
            <div className="modal-buttons">
              <button
                className="modal-button confirm"
                onClick={handleConfirmCancel}
              >
                확인
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowCancelModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Confirmation Modal */}
      {showRefundModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">환불 신청을 할까요?</h3>
            <p className="modal-message">'확인'을 누르시면 환불 요청 페이지로 넘어갑니다.</p>
            <div className="modal-buttons">
              <button
                className="modal-button confirm"
                onClick={handleConfirmRefund}
              >
                확인
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowRefundModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">상품을 잘 받으셨나요?</h3>
            <p className="modal-message">
              구매 확정 이후에는 반품/교환 신청이 어려우니<br/>
              꼭 상품을 받은 후 구매확정 해주세요.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                취소
              </button>
              <button
                className="modal-button confirm"
                onClick={handleConfirmPurchase}
              >
                네, 받았어요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
