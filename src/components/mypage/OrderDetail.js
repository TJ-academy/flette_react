// src/pages/OrderDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/OrderDetail.css";

export default function OrderDetail() {
  const { id } = useParams();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const orderNumber = "17653049281";
  const orderDate = "2025.07.31 오후 03:19";
  const orderItems = [
    { status: "배송 중", date: "8/1(금) 배송 시작", name: "커스텀 꽃다발 (소)", price: "19,800원", img: "/images/sample1.jpg", action: "배송 조회하기" },
    { status: "배송 완료", date: "8/2(토) 배송 완료", name: "커스텀 꽃다발 (중)", price: "19,800원", img: "/images/sample2.jpg", action: "구매 확정" },
    { status: "구매 확정", date: "8/3(일) 배송 완료", name: "커스텀 꽃다발 (대)", price: "19,800원", img: "/images/sample3.jpg", action: "리뷰 쓰기" },
  ];
  const totalPrice = "53,242원";

  useEffect(() => {
    const nameFromSession = sessionStorage.getItem("loginName");
    if (nameFromSession) setCustomerName(nameFromSession);

    axios
      .get("/api/member/me")
      .then((res) => {
        if (!nameFromSession && res?.data?.username) {
          setCustomerName(res.data.username);
        }
        if (res?.data?.tel) setPhoneNumber(res.data.tel);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="orderdetail">
      <h2 className="orderdetail-title">주문상세</h2>

      {/* 주문번호/날짜 박스 */}
      <div className="orderdetail-container">
        <p>주문번호 {orderNumber}</p>
        <p>결제 날짜: {orderDate}</p>
      </div>

      {/* 상품 목록 박스 */}
      <div className="orderdetail-container">
        {orderItems.map((item, idx) => (
          <div className="orderdetail-item" key={idx}>
            <div className="orderdetail-status">
              <span className="status-label">{item.status}</span>{" "}
              <span className="status-date">{item.date}</span>
            </div>
            <div className="orderdetail-body">
              <img className="orderdetail-thumb" src={item.img} alt={item.name} />
              <div className="orderdetail-text">
                <div className="orderdetail-name">{item.name}</div>
                <div className="orderdetail-price">{item.price}</div>
              </div>
              <button className="orderdetail-btn">{item.action}</button>
            </div>
          </div>
        ))}
      </div>

{/* 주문자 정보 박스 */}
<div className="orderdetail-container">
  <p>
    주문자 정보 | <strong>{customerName || "로그인 필요"}</strong> {phoneNumber || ""}
  </p>
  <p>
    결제 정보<br />
    {totalPrice}
  </p>
</div>
</div>
);
}
