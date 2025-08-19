import React, { useState, useEffect } from "react";
import axios from "axios";
import BouquetInfoList from "./BouquetInfoList";

export default function CartList() {
    const [items, setItems] = useState([]);
    const userid = sessionStorage.getItem('loginId')

    // 장바구니 목록 로드
    const loadCartItems = async () => {
        try {
            const res = await axios.get(`/api/cart/list/${userid}`);
            console.log("장바구니 로딩 성공");
            // console.log( 'data:'+JSON.stringify(res.data));
            setItems(res.data.carts);
        } catch (err) {
            console.error("장바구니 로딩 실패", err);
        }
    };

    // 수량 변경 처리
    const handleQuantityChange = async (e, cartId) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity < 1) return; // 수량은 1 미만이 될 수 없도록 방지

        setItems(prevItems =>
            prevItems.map(item =>
                item.cartId === cartId ? {
                        ...item,
                        quantity: newQuantity,
                        totalPrice: newQuantity * item.price,
                    } : item
            )
        );

        try {
            await axios.patch(`/api/cart/update/${cartId}`, { quantity: newQuantity });
        } catch (err) {
            console.error("수량 업데이트 실패", err);
        }
    };

    // 장바구니에서 항목 삭제
    const removeFromCart = async (cartId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/cart/remove/${cartId}`);
                loadCartItems();
            } catch (err) {
                console.error("삭제 실패", err);
            }
        }
    };

    // 주문하기
    const handleCheckout = async () => {
        try {
            const res = await axios.post(`/api/cart/checkout/${userid}`);
            alert(res.data);
            loadCartItems(); // 주문 후 장바구니 목록 비우기
        } catch (err) {
            console.error("주문 실패", err);
            alert("주문 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <div className="page">
            <div className="wrap">
                <div className="title">장바구니</div>

                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="th">번호</th>
                                <th className="th">상품명</th>
                                <th className="th">수량</th>
                                <th className="th">가격</th>
                                <th className="th">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length ? (
                                items.map((item, index) => (
                                    <tr key={item.cartId} className="row">
                                        <td>{index + 1}</td>
                                        <td className="td text-left">
                                            <p>{item.productName}</p>
                                            <BouquetInfoList bouquetInfoList={item.bouquetInfoList} />
                                        </td>
                                        <td className="td">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity} // 개별 아이템의 quantity 사용
                                                onChange={(e) => handleQuantityChange(e, item.cartId)}
                                                className="cart-quantity"
                                                style={{ width: "60px" }}
                                            />
                                        </td>
                                        <td className="td">{item.totalPrice.toLocaleString()}원</td>
                                        <td className="td">
                                            <button
                                                className="danger-btn"
                                                onClick={() => removeFromCart(item.cartId)}
                                            >
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty">
                                        장바구니가 비어 있습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="btn-row" style={{ justifyContent: "space-between" }}>
                    <div className="total-price">
                        총 금액: {totalPrice.toLocaleString()}원
                    </div>
                    <button className="primary-btn" onClick={handleCheckout}>
                        주문하기
                    </button>
                </div>
            </div>
        </div>
    );
}