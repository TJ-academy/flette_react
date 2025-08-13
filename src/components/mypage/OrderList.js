import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/OrderList.css"; 

function OrderList() {
  const navigate = useNavigate();

  const orders = [
    {
      date: "2025.08.03",
      items: [
        { name: "카드 꽃다발 (소)", price: "19,800원", status: "배송중", id: 1, img: "/images/flower1.jpg" },
      ],
    },
    {
      date: "2025.07.31",
      items: [
        { name: "카드 꽃다발 (소)", price: "19,800원", status: "배송완료", id: 2, img: "/images/flower2.jpg" },
        { name: "카드 꽃다발 (중)", price: "19,800원", status: "배송완료", id: 3, img: "/images/flower3.jpg" },
        { name: "그림꽃", price: "19,800원", status: "배송완료", id: 4, img: "/images/flower4.jpg" },
      ],
    },
    {
      date: "2025.05.03",
      items: [
        { name: "카드 꽃다발 (소)", price: "19,800원", status: "취소/반품", id: 5, img: "/images/flower5.jpg" },
        { name: "그림꽃", price: "19,800원", status: "취소/반품", id: 6, img: "/images/flower6.jpg" },
      ],
    },
  ];

  return (
    <main className="orderlist">
      <section className="orderlist-container">

      <h2 className="orderlist-title">주문내역</h2>

        {/* 상태별 주문 개수 */}
        <div className="orderlist-status-wrap">
          <StatusCount label="배송중" count={1} />
          <StatusCount label="배송완료" count={2} />
          <StatusCount label="취소/반품" count={0} />
        </div>

        {/* 주문 목록 */}
        <div className="orderlist-list">
          {orders.map((order, index) => (
            <div key={index} className="orderlist-group">
              <div className="orderlist-date">{order.date}</div>
              {order.items.map((item) => (
                <div key={item.id} className="orderlist-item">
                  <img src={item.img} alt={item.name} className="orderlist-thumb" />
                  <div className="orderlist-info">
                  <div className={`orderlist-status ${item.status}`}>{item.status}</div>
                    <div className="orderlist-name">{item.name}</div>
                    <div className="orderlist-price">{item.price}</div>
                  </div>
                  <button
  onClick={() => navigate(`/mypage/order/detail/${item.id}`)}
  className="orderlist-arrow"
>
  ›
</button>

                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// 상태별 주문 개수
function StatusCount({ label, count }) {
  return (
    <div className="orderlist-status-card">
      <div className="orderlist-status-label">{label}</div>
      <div className="orderlist-status-num">{count}</div>
    </div>
  );
}

export default OrderList;
