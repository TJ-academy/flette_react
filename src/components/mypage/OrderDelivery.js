import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDelivery.css";

function OrderDelivery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {

        const res = await axios.get(`/api/orders/${id}/detail`);
        console.log("배송 데이터:", res.data); // 디버깅 로그
        setOrder(res.data);
      } catch (err) {
        console.error("배송 정보를 불러올 수 없습니다.", err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p>로딩중...</p>;

  const steps = ["배송 시작", "배송 중", "배송 완료"];

  const statusMap = {
    "배송시작": "배송 시작",
    "배송 시작": "배송 시작",
    "배송중": "배송 중",
    "배송 중": "배송 중",
    "배송완료": "배송 완료",
    "배송 완료": "배송 완료",
  };

  const currentStatus = statusMap[order.status] || order.status;
  const currentStep = steps.indexOf(currentStatus);

  return (
    <div className="order-delivery">
      <h2>
      <span className="date">
        {order.orderDate?.slice(5, 10).replace("-", "/")} 
        </span>{" "}
        {currentStatus}이에요
      </h2>

      <div className="progress-bar">
  {steps.map((step, idx) => (
    <div
      key={idx}
      className={`step ${idx <= currentStep ? "done" : ""} ${idx === currentStep ? "active" : ""}`}
    >
      <div className="line"></div>
      <span className="label">{step}</span>
    </div>
  ))}
</div>



      <div className="order-items">
        {order.details?.map((item, i) => (
          <div key={i} className="order-item">
            <img
              src={`/img/product/${item.imageName}`}
              alt={item.productName}
            />
            <div>
              <p>{item.productName}</p>
              <p>{item.money.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">
        뒤로 가기
      </button>
    </div>
  );
}

export default OrderDelivery;
