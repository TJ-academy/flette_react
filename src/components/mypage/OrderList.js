import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/OrderList.css";
import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = "https://sure-dyane-flette-f3f77cc0.koyeb.app/api/orders";

// 주문 상태를 CSS 클래스명으로 변환하는 함수 추가
const getStatusClass = (status) => {
  switch (status) {
    case "취소/반품":
      return "cancelled-returned";
    case "배송중":
      return "on-delivery";
    case "배송완료":
      return "delivered";
    case "결제완료":
        return "paid";
    default:
      return "default";
  }
};

function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = sessionStorage.getItem("loginId");

  useEffect(() => {
    if (!userId) {
      setError("로그인 정보가 없습니다.");
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/history/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError("주문 내역을 불러오는 데 실패했습니다.");
        console.error("API 호출 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <main className="orderlist">
        <div>주문 내역을 불러오는 중...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orderlist">
        <div>{error}</div>
      </main>
    );
  }

  // orders 배열의 각 주문 객체에 있는 status 필드를 기반으로 count를 계산
  const statusCounts = orders.reduce(
    (acc, order) => {
      if (order.status === "배송중") {
        acc.onDelivery++;
      } else if (order.status === "배송완료") {
        acc.delivered++;
      } else if (order.status === "취소/반품") {
        acc.cancelledReturned++;
      } else if (order.status === "결제완료") {
        acc.paid++;
      }
      return acc;
    },
    { onDelivery: 0, delivered: 0, cancelledReturned: 0, paid: 0 }
  );

  return (
    <main className="orderlist">
      <section className="orderlist-container">
        <h2 className="orderlist-title">주문내역</h2>
        
        {/* 상태별 주문 개수 */}
        <div className="orderlist-status-wrap">
          <StatusCount label="배송중" count={statusCounts.onDelivery} />
          <StatusCount label="배송완료" count={statusCounts.delivered} />
          <StatusCount label="취소/반품" count={statusCounts.cancelledReturned} />
          <StatusCount label="결제완료" count={statusCounts.paid} />
        </div>

        {/* 주문 목록 */}
        <div className="orderlist-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.orderId} className="orderlist-group">
                {/* 주문 날짜 표시 */}
                <div className="orderlist-date">
                  {new Date(order.orderDate).toLocaleDateString("ko-KR")}
                </div>
                {/* 각 주문의 상세 아이템 렌더링 */}
                {order.details.map((item) => (
                  <div key={item.detailId} className="orderlist-item">
                    <img
                      src={`https://sure-dyane-flette-f3f77cc0.koyeb.app/img/product/${item.imageName}`} // 실제 이미지 경로로 수정
                      alt={item.productName}
                      className="orderlist-thumb"
                    />
                    <div className="orderlist-info">
                      {/* 이 부분이 변경되었습니다! */}
                      <div className={`orderlist-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </div>
                      <div className="orderlist-name">{item.productName}</div>
                      <div className="orderlist-price">
                        {item.money.toLocaleString()}원
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/mypage/order/detail/${order.orderId}`)}
                      className="orderlist-arrow"
                    >
                      ›
                    </button>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="no-orders"
            >주문 내역이 없습니다.</div>
          )}
        </div>
      </section>
    </main>
  );
}

// 상태별 주문 개수 컴포넌트
function StatusCount({ label, count }) {
  return (
    <div className="orderlist-status-card">
      <div className="orderlist-status-label">{label}</div>
      <div className="orderlist-status-num">{count}</div>
    </div>
  );
}

export default OrderList;