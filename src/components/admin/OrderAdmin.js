import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/admin.css"; // CSS 경로 맞춰주세요

function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // 선택된 주문 ID
  const [selectedOrder, setSelectedOrder] = useState(null); // 선택된 주문의 상세 정보
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
      setSelectedStatus(res.data.order.status);
      // 주문 상태와 상세 정보를 업데이트
      setSelectedOrder(res.data.order);
    } catch (err) {
      console.error("주문 상세 불러오기 실패", err);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderId) return;

    try {
      await axios.patch(`/api/admin/orders/${selectedOrderId}/status`, {
        status: selectedStatus,
      });
      alert(`주문 #${selectedOrderId}의 상태가 '${selectedStatus}'(으)로 변경되었습니다.`);
      loadOrders();
    } catch (err) {
      console.error("상태 변경 실패", err);
      alert("상태 변경에 실패했습니다. 콘솔을 확인해주세요.");
    }
  };

  const handleRefundOrder = async () => {
    await axios.patch(`/api/admin/orders/${selectedOrderId}/status`, {
        status: '환불완료',
      });
      alert(`주문 #${selectedOrderId}를 환불 처리합니다.`);
      loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setSelectedOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
    if (selectedOrderId !== orderId) {
      loadOrderDetail(orderId); // 선택한 주문에 대한 상세 정보를 로드
    }
  };

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
                <th className="th">상세보기</th> {/* 추가된 열 */}
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <React.Fragment key={o.orderId}>
                    <tr className="row">
                      <td className="td">{o.orderId}</td>
                      <td className="td">{o.userid}</td>
                      <td className="td">{o.totalMoney?.toLocaleString()}원</td>
                      <td className="td">{o.status}</td>
                      <td className="td">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : ""}</td>
                      <td className="td">
                        <button
                          type="button"
                          onClick={() => toggleOrderDetails(o.orderId)}
                          className="oBtn"
                        >
                          {selectedOrderId === o.orderId ? "닫기" : "상세보기"}
                        </button>
                      </td>
                    </tr>

                    {/* 주문 상세보기 */}
                    {selectedOrderId === o.orderId && (
                      <tr>
                        <td colSpan="6" className="p-0">
                          <div className="detail-card">
                            <h3 className="detail-title">주문 상세 #{o.orderId}</h3>

                            <div className="detail-row">
                              <span className="label">회원 ID</span>
                              <span>{o.userid}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">총 금액</span>
                              <span>{o.totalMoney}원</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">결제방법</span>
                              <span>{o.method}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">상태</span>
                              <span>
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
                              </span>
                            </div>

                            <h4 style={{ marginTop: "14px" }}>상품 목록</h4>
                            {o.items && o.items.length > 0 ? ( // `o.items`가 존재하고, 길이가 0보다 클 때만 렌더링
                              <table className="table">
                                <thead>
                                  <tr className="head-row">
                                    <th className="th">상품명</th>
                                    <th className="th">금액</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {o.items.map((item) => (
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
                                className="pBtn"
                                onClick={handleUpdateStatus}
                              >
                                상태 변경
                              </button>
                              <button
                                className="danger-btn"
                                onClick={handleRefundOrder}
                                style={{height:'10px'}}
                              >
                                환불 처리
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty">주문이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderAdmin;
