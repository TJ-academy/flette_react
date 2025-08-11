// src/pages/OrderHistory.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderList() {
  const navigate = useNavigate();

  // 더미 데이터 (실제론 API로 불러오기)
  const orders = [
    {
      date: "2025.08.03",
      items: [
        { name: "컬러 테라피", price: "19,800원", status: "배송중", id: 1 },
      ],
    },
    {
      date: "2025.07.31",
      items: [
        { name: "예쁜 꽃", price: "19,800원", status: "배송완료", id: 2 },
        { name: "예쁜 꽃", price: "19,800원", status: "배송완료", id: 3 },
        { name: "그림꽃", price: "19,800원", status: "배송완료", id: 4 },
      ],
    },
    {
      date: "2025.05.03",
      items: [
        { name: "예쁜꽃", price: "19,800원", status: "취소/반품", id: 5 },
        { name: "그림꽃", price: "19,800원", status: "취소/반품", id: 6 },
      ],
    },
  ];

  return (
    <main style={{ padding: "24px 16px" }}>
      <section
        style={{
          width: "min(560px, 92vw)",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
        }}
      >
        {/* 상태별 주문 개수 */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <StatusCount label="배송중" count={1} />
          <StatusCount label="배송완료" count={2} />
          <StatusCount label="취소/반품" count={0} />
        </div>

        {/* 주문 목록 */}
        <div style={{ marginTop: 16 }}>
          {orders.map((order, index) => (
            <div key={index} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: 8,
                  fontSize: 16,
                }}
              >
                {order.date}
              </div>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: 8,
                    paddingTop: 8,
                  }}
                >
                  <div>
                    <div>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>
                      {item.status}
                    </div>
                  </div>
                  <div>{item.price}</div>
                  <button
                    onClick={() => navigate(`/order/detail/${item.id}`)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#f76c6c",
                      cursor: "pointer",
                    }}
                  >
                    <span></span>
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

// 상태별 주문 개수 컴포넌트
function StatusCount({ label, count }) {
  return (
    <div
      style={{
        textAlign: "center",
        flex: 1,
        padding: "8px 16px",
        backgroundColor: "#f3f3f3",
        borderRadius: 6,
      }}
    >
      <div style={{ fontWeight: "bold" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: "bold" }}>{count}</div>
    </div>
  );
}

export default OrderList;