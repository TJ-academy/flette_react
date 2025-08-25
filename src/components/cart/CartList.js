import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BouquetInfoList from "./BouquetInfoList";
import "../../css/orders/cart.css";   // ✅ cart.css 전용 스타일만

export default function CartList() {
    const [items, setItems] = useState([]);
    const [selectedCartIds, setSelectedCartIds] = useState([]);
    const navigate = useNavigate();
    const userid = sessionStorage.getItem('loginId');

    // 장바구니 목록 로드
    const loadCartItems = async () => {
        try {
            const res = await axios.get(`/api/cart/list/${userid}`);
            console.log("장바구니 로딩 성공");
            setItems(res.data.carts);
            setSelectedCartIds(res.data.carts.map(item => item.cartId));
        } catch (err) {
            console.error("장바구니 로딩 실패", err);
        }
    };

    // 체크박스 - 개별 선택
    const handleSelectItem = (cartId) => {
        setSelectedCartIds(prev =>
            prev.includes(cartId)
                ? prev.filter(id => id !== cartId)
                : [...prev, cartId]
        );
    };

    // 체크박스 - 전체 선택
    const handleSelectAll = () => {
        if (selectedCartIds.length === items.length) {
            setSelectedCartIds([]);
        } else {
            setSelectedCartIds(items.map(item => item.cartId));
        }
    };

    // 수량 변경 처리
    const handleQuantityChange = async (e, cartId) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity < 1) return;

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

    // 선택한 장바구니 지우기
    const removeSelected = async () => {
        if (window.confirm("선택한 장바구니를 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/cart/remove/selected/${userid}`, {data: selectedCartIds});
                loadCartItems();
            } catch (err) {
                console.error("장바구니 삭제 중 오류가 발생했습니다.", err);
            }
        }
    }

    // 장바구니 비우기
    const removeAll = async () => {
        if (window.confirm("장바구니를 비우시겠습니까?")) {
            try {
                const res = await axios.delete(`/api/cart/remove/all/${userid}`);
                alert(res.data.message);
                loadCartItems();
            } catch (err) {
                console.error("전체 삭제 실패", err);
                alert("장바구니 비우기 중 오류가 발생했습니다.");
            }
        }
    }

    // 주문하기
    const handleCheckout = async () => {
        if (selectedCartIds.length === 0) {
            alert("주문할 항목을 선택해주세요.");
            return;
        }

        try {
            const res = await axios.post(`/api/orders/cart/${userid}`, selectedCartIds);
            navigate(`/orders/${res.data}`);
        } catch (err) {
            console.error("주문 실패", err);
            alert("주문 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    const totalPrice = items
        .filter(item => selectedCartIds.includes(item.cartId))
        .reduce((sum, item) => sum + item.totalPrice, 0);

    const isAllSelected = items.length > 0 && selectedCartIds.length === items.length;

    return (
        <div className="cart-page">
            <div className="page">
                <div className="wrap">
                    <div className="title">장바구니</div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="th">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
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
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCartIds.includes(item.cartId)}
                                                    onChange={() => handleSelectItem(item.cartId)}
                                                />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td className="td text-left">
                                                <img
                                                    src={`http://localhost:80/img/product/${item.productImageName}`}
                                                    alt={item.flowerName || item.decorationName}
                                                    className="cart-img"
                                                />
                                                <p>{item.productName}</p>
                                                <BouquetInfoList bouquetInfoList={item.bouquetInfoList} />
                                            </td>
                                            <td className="td">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(e, item.cartId)}
                                                    className="cart-quantity"
                                                />
                                            </td>
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
                                        <td colSpan="6" className="empty">
                                            장바구니가 비어 있습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="cart-total">
                            총 금액: {totalPrice.toLocaleString()}원
                        </div>

                    <div className="btn-row">
                        <button className="clean-btn" onClick={removeAll}>
                            장바구니 비우기
                        </button>
                        <button className="clean-btn" onClick={removeSelected}>
                            선택항목 지우기
                        </button>
                        <button className="buy-btn" onClick={handleCheckout}>
                            주문하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
