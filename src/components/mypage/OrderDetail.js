import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDetail.css";

// CSS for the modal and component display
const modalStyles = `
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
  /* New styles for bouquet components */
  .orderdetail-components {
    margin-top: 20px;
    font-size: 0.9rem;
    color: #555;
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
  }
  .orderdetail-components-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: none;
    margin-bottom: 10px;
    color: #584245;
  }
  .orderdetail-components ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out; /* Smooth transition for collapsing */
    max-height: 0; /* Hidden by default */
  }
  .orderdetail-components ul.open {
    max-height: 500px; /* A value large enough to show all content */
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
  /* New style for the single action button at the bottom */
  .orderdetail-action-button-container {
    padding-top: 20px;
    text-align: center;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 구매 확정 모달 상태
  const [isComponentsOpen, setIsComponentsOpen] = useState(false); // New state for collapsible components

  useEffect(() => {
    // 1. 사용자 정보 (세션 또는 API) 가져오기
    const nameFromSession = sessionStorage.getItem("loginName");
    if (nameFromSession) setCustomerName(nameFromSession);

    axios.get("/api/member/me")
      .then((res) => {
        if (!nameFromSession && res?.data?.username) {
          setCustomerName(res.data.username);
        }
        if (res?.data?.tel) setPhoneNumber(res.data.tel);
      })
      .catch(() => {
        // 사용자 정보 로딩 실패는 주문 상세 로딩에 치명적이지 않으므로 별도 처리 없음
      });

    // 2. 주문 상세 데이터 API 호출
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${id}/detail`);
        setOrderDetail(response.data);
      } catch (err) {
        console.error("주문 상세 정보를 불러오는 데 실패했습니다.", err);
        setError("주문 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.patch(`/api/orders/cancel/${id}`);
      // Replaced alert with custom modal
      setShowCancelModal(false);
      navigate(`/orders/cancel/${id}`);
    } catch (err) {
      console.error("주문 취소 실패:", err);
      // Replaced alert with custom modal
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
      // Replaced alert with custom modal
      setShowRefundModal(false);
    }
  };

  // Function called when the purchase confirmation button is clicked
  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  // Function called when 'Yes, I received it' is clicked on the modal
  const handleConfirmPurchase = async () => {
    try {
      // API call: endpoint to change delivery status to '구매확정'
      await axios.patch(`/api/orders/confirm/${id}`);
      // Replaced alert with custom modal
      setShowConfirmModal(false);

      // Update status or refresh the page
      window.location.reload();

    } catch (err) {
      console.error("구매 확정 실패:", err);
      // Replaced alert with custom modal
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

  // This function now renders a single action button for the entire order
  const renderActionButton = (status, hasReview, bouquetCode) => {
    switch (status) {
      case "입금확인중":
        return <button className="orderdetail-btn" onClick={handleCancelClick}>주문 취소</button>;
      case "결제완료":
        return <button className="orderdetail-btn" onClick={handleRefundClick}>환불 요청</button>;
      case "배송중":
        return (
          <button
            className="orderdetail-btn"
            onClick={() => navigate(`/mypage/order/delivery/${id}`)}
          >
            배송 조회하기
          </button>
        );
      case "배송완료":
        // Connect the purchase confirmation button to the new function
        return <button className="orderdetail-btn" onClick={handleConfirmClick}>구매 확정</button>;
      case "구매확정":
        if (hasReview) {
          return <button className="orderdetail-btn" disabled>리뷰 작성 완료</button>;
        } else {
          return (
            <button
              className="orderdetail-btn"
              onClick={() => navigate(`/mypage/reviews/write/${bouquetCode}`)}
            >
              리뷰 쓰기
            </button>
          );
        }
      default:
        return null;
    }
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
    <style>{modalStyles}</style>
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
                src={`/img/product/${item.imageName}`}
                alt={item.productName}
              />
              <div className="orderdetail-text">
                <div className="orderdetail-name">{item.productName}</div>
                <div className="orderdetail-price">{formatPrice(item.money)}</div>

                <div className="orderdetail-action-button-container">
            {renderActionButton(orderDetail.status, item.hasReview, item.bouquetCode)}
          </div>

                {/* 부케 구성 */}
                <div className="orderdetail-components">
                  <div
                    className="orderdetail-components-header"
                    onClick={toggleComponents}
                  >
                    <span>부케 구성</span>
                    <span
                      className={`toggle-arrow ${
                        isComponentsOpen ? "rotated" : ""
                      }`}
                    >
                      &#9660;
                    </span>
                  </div>
                  {item.components && (
                    <ul className={isComponentsOpen ? "open" : ""}>
                      {item.components.map((component, compIdx) => (
                        <li key={compIdx} className="component-item">
                          <span className="component-type-name">
                            <strong>
                              {getComponentTypeLabel(component.type)}
                            </strong>{" "}
                            {component.name}
                          </span>
                          {component.addPrice > 0 && (
                            <span className="component-price">
                              +{formatPrice(component.addPrice)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
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
