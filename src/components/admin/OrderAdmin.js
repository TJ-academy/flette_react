import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/admin.css"; // CSS 경로 맞춰주세요

function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // 주문 목록 로드
  const loadOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders", {
        params: { page: 0, size: 10 },
      });
      setOrders(res.data.content || []);
    } catch (err) {
      console.error("주문 목록 불러오기 실패", err);
    }
  };

  // 주문 상세 로드
  const loadOrderDetail = async (orderId) => {
    try {
      const res = await axios.get(`/api/admin/orders/${orderId}`);
      setSelectedOrder(res.data);
      // 주문 상태를 select의 초기값으로 설정
      setSelectedStatus(res.data.order.status);
    } catch (err) {
      console.error("주문 상세 불러오기 실패", err);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await axios.patch(`/api/admin/orders/${selectedOrder.order.orderId}/status`, {
        status: selectedStatus,
      });
      alert(`주문 #${selectedOrder.order.orderId}의 상태가 '${selectedStatus}'(으)로 변경되었습니다.`);
      // 변경 후 목록과 상세 정보 다시 로드
      loadOrders();
      loadOrderDetail(selectedOrder.order.orderId);
    } catch (err) {
      console.error("상태 변경 실패", err);
      alert("상태 변경에 실패했습니다. 콘솔을 확인해주세요.");
    }
  };

  const handleRefundOrder = () => {
    // 환불 처리 로직을 여기에 구현하세요.
    // 예: axios.post(`/api/admin/orders/${selectedOrder.order.orderId}/refund`);
    alert(`주문 #${selectedOrder.order.orderId}를 환불 처리합니다.`);
    console.log(`주문 #${selectedOrder.order.orderId}를 환불 처리`);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="page">
      <div className="wrap">
        <div className="title">관리자 주문</div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr className>
                <th className="th">주문번호</th>
                <th className="th">회원ID</th>
                <th className="th">결제금액</th>
                <th className="th">상태</th>
                <th className="th">주문일자</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr
                    key={o.orderId}
                    className="row"
                    onClick={() => loadOrderDetail(o.orderId)}
                  >
                    <td className="td">{o.orderId}</td>
                    <td className="td">{o.userid}</td>
                    <td className="td">{o.totalMoney?.toLocaleString()}원</td>
                    <td className="td">{o.status}</td>
                    <td className="td">
                      {o.orderDate
                        ? new Date(o.orderDate).toLocaleDateString()
                        : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty">
                    주문이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 상세 패널 */}
        {selectedOrder && (
          <div className="detail-card">
            <div className="detail-title">
              주문 상세 #{selectedOrder.order.orderId}
            </div>

            <div className="detail-row">
              <div className="label">회원 ID</div>
              <div>{selectedOrder.order.userid}</div>

              <div className="label">총 금액</div>
              <div>{selectedOrder.order.totalMoney}원</div>

              <div className="label">결제방법</div>
              <div>{selectedOrder.order.method}</div>

              <div className="label">상태</div>
              <div>
                <select name="status" value={selectedStatus} onChange={handleStatusChange}>
                  <option value="입금확인중">입금확인중</option>
                  <option value="취소완료">취소완료</option>
                  <option value="결제완료">결제완료</option>
                  <option value="환불요청">환불요청</option>
                  <option value="환불완료">환불완료</option>
                  <option value="배송중">배송중</option>
                  <option value="배송완료">배송완료</option>
                  <option value="구매확정">구매확정</option>
                </select>
              </div>
            </div>

            <h4 style={{ marginTop: "14px" }}>상품 목록</h4>
            {selectedOrder.items.length > 0 ? (
              <table className="table">
                <thead>
                  <tr className="head-row">
                    <th className="th">상품명</th>
                    <th className="th">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.detailId} className="row">
                      <td className="td">{item.productName || "-"}</td>
                      <td className="td">{item.money}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty">상품이 없습니다.</div>
            )}

            <div className="detail-btns">
              <button
                className="primary-btn"
                onClick={handleUpdateStatus}
              >
                상태 변경
              </button>
              <button
                className="danger-btn"
                onClick={handleRefundOrder}
              >
                환불 처리
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderAdmin;