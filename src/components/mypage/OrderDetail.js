import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDetail.css";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

  if (loading) {
    return <div className="orderdetail">로딩 중...</div>;
  }

  if (error) {
    return <div className="orderdetail error-message">{error}</div>;
  }

  if (!orderDetail) {
    return <div className="orderdetail">주문 정보를 찾을 수 없습니다.</div>;
  }

  // 데이터 포맷팅 (예: 날짜, 금액)
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

  // 상태에 따라 버튼 렌더링을 결정하는 함수
  const renderActionButton = (status, hasReview, bouquetCode) => {
    switch (status) {
      case "입금확인중":
        return <button className="orderdetail-btn">주문 취소</button>;
      case "결제완료":
        return <button className="orderdetail-btn">환불 요청</button>;
      case "배송중":
        return <button className="orderdetail-btn">배송 조회하기</button>;
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
      case "결제완료":
        return <button className="orderdetail-btn">환불 요청</button>;
      default:
        return null;
    }
  };

  return (
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
              {/* 동적 버튼 렌더링 */}
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
  );
}