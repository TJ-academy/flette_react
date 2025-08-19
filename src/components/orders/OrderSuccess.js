import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/orders/ordersuccess.css'; // CSS 파일 경로 추가

function OrderSuccess() {
  const navigate = useNavigate();

  const handleOrderDetailsClick = () => {
    navigate('/mypage/order'); // "나의 주문내역" 페이지로 이동
  };

  return (
    <div className="order-success-container">
      <p className="order-success-title">주문이 완료되었습니다! 🌸</p>

      <p className="order-success-message">
        주문이 성공적으로 완료되었습니다. <br />
        당신의 꽃다발이 곧 도착할 예정이에요. <br />
        감사합니다. Flette에서의 꽃다발을 즐겨보세요!
      </p>

      <button
        type="button"
        className="order-success-button"
        onClick={handleOrderDetailsClick} // "나의 주문내역"으로 이동
      >
        나의 주문내역
      </button>
    </div>
  );
}

export default OrderSuccess;
