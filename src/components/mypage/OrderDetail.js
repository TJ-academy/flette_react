import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDetail.css";

// CSS for the modal
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
`;

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false); // New state for modal
  const [showRefundModal, setShowRefundModal] = useState(false);

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

  // Handle click on cancel button to open modal
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  // Handle confirmation in modal and call API
  const handleConfirmCancel = async () => {
    try {
      // API 호출
      await axios.patch(`/api/orders/cancel/${id}`);
      alert("주문이 성공적으로 취소되었습니다.");
      setShowCancelModal(false);
      // API 호출 성공 후 페이지 이동
      navigate(`/orders/cancel/${id}`);
    } catch (err) {
      console.error("주문 취소 실패:", err);
      // 실패 시 사용자에게 알림
      alert("주문 취소에 실패했습니다. 현재 상태에서는 취소할 수 없습니다.");
      setShowCancelModal(false);
    }
  };

  // Handle click on cancel button to open modal
  const handleRefundClick = () => {
    setShowRefundModal(true);
  };

  // Handle confirmation in modal and call API
  const handleConfirmRefund = async () => {
    try {
      setShowRefundModal(false);
      navigate(`/orders/refund/${id}`);
    } catch (err) {
      console.error("환불 요청 실패:", err);
      // 실패 시 사용자에게 알림
      alert("환불 요청에 실패했습니다. 현재 상태에서는 신청 불가합니다.");
      setShowRefundModal(false);
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
        return <button className="orderdetail-btn">구매 확정</button>;
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

        {/* 주문번호/날짜 박스 */}
        <div className="orderdetail-container">
          <p>주문번호 {orderDetail.impUid}</p>
          <p>결제 날짜: {formatOrderDate(orderDetail.orderDate)}</p>
        </div>

        {/* 상품 목록 박스 */}
        <div className="orderdetail-container">
          {orderDetail.details.map((item, idx) => (
            <div className="orderdetail-item" key={idx}>
              <div className="orderdetail-status">
                <span className="status-label">{orderDetail.status}</span>
              </div>
              <div className="orderdetail-body">
                <img className="orderdetail-thumb" src={`/img/product/${item.imageName}`} alt={item.productName} />
                <div className="orderdetail-text">
                  <div className="orderdetail-name">{item.productName}</div>
                  <div className="orderdetail-price">{formatPrice(item.money)}</div>
                </div>
                {renderActionButton(orderDetail.status, item.hasReview, item.bouquetCode)}
              </div>
            </div>
          ))}
        </div>

        {/* 주문자 정보 박스 */}
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

      {/* 주문 취소 확인 모달 */}
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

      {/* 환불 요청 확인 모달 */}
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
                onClick={() => setShowCancelModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}