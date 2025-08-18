import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CartList() {
    const [cartItems, setCartItems] = useState([]);

    // 장바구니 목록 로드
    const loadCartItems = async () => {
        try {
            const userId = sessionStorage.getItem('loginId')
            const res = await axios.get(`/api/cart/list/${userId}`);
            setCartItems(res.data);
        } catch (err) {
            console.error("장바구니 로딩 실패", err);
        }
    };

    // 수량 변경 처리
    const handleQuantityChange = async (e, cartId) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity < 1) return; // 수량은 1 미만이 될 수 없도록 방지

        try {
            await axios.patch(`/api/cart/update/${cartId}`, { quantity: newQuantity });
            loadCartItems(); // 업데이트 후 목록 다시 불러오기
        } catch (err) {
            console.error("수량 업데이트 실패", err);
        }
    };

    // 장바구니에서 항목 삭제
    const removeFromCart = async (cartId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/cart/remove/${cartId}`);
                loadCartItems(); // 삭제 후 목록 다시 불러오기
            } catch (err) {
                console.error("삭제 실패", err);
            }
        }
    };

    // 주문하기
    const handleCheckout = async () => {
        try {
            const userId = 'testuser'; // 예시: 실제 로그인된 사용자 ID로 대체
            const res = await axios.post(`/api/cart/checkout/${userId}`);
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

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <div className="page">
            <div className="wrap">
                <div className="title">장바구니</div>

                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="th">상품명</th>
                                <th className="th">수량</th>
                                <th className="th">가격</th>
                                <th className="th">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length ? (
                                cartItems.map((item) => (
                                    <tr key={item.cartId} className="row">
                                        <td className="td text-left">{item.flower.flowerName}</td>
                                        <td className="td">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity} // 개별 아이템의 quantity 사용
                                                onChange={(e) => handleQuantityChange(e, item.cartId)}
                                                className="textarea"
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
                                    <td colSpan="4" className="empty">
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