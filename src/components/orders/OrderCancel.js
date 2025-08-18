import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDetail.css"; // CSS 파일을 재사용

const pageStyles = `
  .cancel-page-container {
    padding: 40px 20px;
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    font-family: 'Inter', sans-serif;
  }
  .cancel-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #f77893;
    text-align: center;
    margin-bottom: 30px;
  }
  .cancel-section {
    border-top: 1px solid #e0e0e0;
    padding: 20px 0;
  }
  .cancel-section-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }
  .canceled-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #f2f2f2;
  }
  .item-details {
    flex-grow: 1;
  }
  .item-name {
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
  }
  .item-options {
    font-size: 0.9rem;
    color: #888;
  }
  .refund-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .refund-label {
    font-size: 1rem;
    color: #555;
  }
  .refund-amount {
    font-size: 1.2rem;
    font-weight: bold;
    color: #f77893;
  }
  .continue-shopping-btn {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #f77893;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 30px;
    transition: background-color 0.2s ease;
  }
  .continue-shopping-btn:hover {
    background-color: #e56580;
  }
`;

function OrderCancel() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderCancelInfo, setOrderCancelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCancelInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/cancel/${orderId}/info`);
        setOrderCancelInfo(response.data);
      } catch (err) {
        console.error("주문 취소 정보를 불러오는 데 실패했습니다.", err);
        setError("주문 취소 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCancelInfo();
  }, [orderId]);

  const getFlowerOptionsString = (flowers) => {
    if (!flowers || flowers.length === 0) return "";
    return flowers.map(f => f.name).join(", ");
  };

  const getFullOptionsString = () => {
    if (!orderCancelInfo) return "";
    const main = getFlowerOptionsString(orderCancelInfo.mainFlowers);
    const sub = getFlowerOptionsString(orderCancelInfo.subFlowers);
    const foliage = getFlowerOptionsString(orderCancelInfo.foliageFlowers);
    
    const parts = [];
    if (main) parts.push(`MAIN ${main}`);
    if (sub) parts.push(`SUB ${sub}`);
    if (foliage) parts.push(`FOLIAGE ${foliage}`);

    return parts.join(" | ");
  };

  if (loading) {
    return <div className="cancel-page-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="cancel-page-container">{error}</div>;
  }

  if (!orderCancelInfo) {
    return <div className="cancel-page-container">주문 취소 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <style>{pageStyles}</style>
      <div className="cancel-page-container">
        <h2 className="cancel-title">주문 취소가 완료되었습니다.</h2>

        <div className="cancel-section">
          <h3 className="cancel-section-title">취소 상품 1개</h3>
          <div className="canceled-item">
            <img 
              src={`/img/product/${orderCancelInfo.imageName}`} 
              alt={orderCancelInfo.productName} 
              className="item-image" 
            />
            <div className="item-details">
              <div className="item-name">{orderCancelInfo.productName}</div>
              <div className="item-options">{getFullOptionsString()}</div>
            </div>
          </div>
        </div>
        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          계속 쇼핑하기
        </button>
      </div>
    </>
  );
}

export default OrderCancel;