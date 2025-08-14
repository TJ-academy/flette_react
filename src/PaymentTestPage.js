import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // 고유한 merchant_uid 생성을 위해 uuid 라이브러리 사용

const getMerchantUid = () => {
    // 고유한 주문번호 (merchant_uid) 생성
    return `mid_${uuidv4()}`;
};

const PaymentTestPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("결제 대기 중");

    // 아임포트 결제 라이브러리 동적 로딩
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.iamport.kr/v1/iamport.js';
        script.onload = () => {
            console.log('아임포트 스크립트 로딩 완료');
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        const dummyProduct = {
            name: "아름다운 플레르 꽃다발",
            amount: 15000,
            buyerName: "김민지",
            buyerTel: "010-1234-5678"
        };
        
        const paymentData = {
            merchant_uid: getMerchantUid(),
            ...dummyProduct
        };
        
        try {
            setLoading(true);
            setStatus("결제 준비 중...");

            // 1. 백엔드 결제 사전 등록 API 호출
            const prepareResponse = await axios.post('/api/orders/prepare', paymentData);
            const merchantUid = prepareResponse.data;

            // 2. 아임포트 결제창 띄우기
            const { IMP } = window;
            IMP.init("imp58115315"); // 여기에 아임포트 가맹점 식별코드 입력

            IMP.request_pay({
                pg: 'kakaopay',
                pay_method: 'card',
                merchant_uid: merchantUid,
                name: paymentData.name,
                amount: paymentData.amount,
                buyer_email: 'test@flette.com',
                buyer_name: paymentData.buyerName,
                buyer_tel: paymentData.buyerTel,
                app_scheme: 'flette_payment'
            }, async (rsp) => {
                setLoading(false);
                if (rsp.success) {
                    setStatus("결제 성공. 백엔드 검증 시작...");

                    // 3. 결제 성공 시, 백엔드 검증 API 호출
                    const verifyResponse = await axios.post('/api/orders/verify', {
                        imp_uid: rsp.imp_uid,
                        merchant_uid: rsp.merchant_uid
                    });

                    if (verifyResponse.status === 200) {
                        setStatus("결제 및 백엔드 검증 완료!");
                        alert("결제가 성공적으로 완료되었습니다!");
                    } else {
                        setStatus("백엔드 검증 실패");
                        alert("결제는 성공했지만, 백엔드 검증에 실패했습니다.");
                    }
                } else {
                    setStatus(`결제 실패: ${rsp.error_msg}`);
                    alert(`결제 실패: ${rsp.error_msg}`);
                }
            });

        } catch (error) {
            setLoading(false);
            setStatus("결제 요청 실패");
            alert("결제 요청 중 오류가 발생했습니다: " + error.message);
        }
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
            <h2>테스트 상품 결제 페이지</h2>
            <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <p style={{ fontWeight: 'bold' }}>상품명: 아름다운 플레르 꽃다발</p>
                <p>가격: 15,000원</p>
                <p>구매자: 김민지</p>
            </div>
            <p style={{ color: '#555' }}>현재 상태: <span style={{ fontWeight: 'bold' }}>{status}</span></p>
            <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    fontSize: '18px',
                    color: '#fff',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s'
                }}
            >
                {loading ? '결제 진행 중...' : '결제하기'}
            </button>
        </div>
    );
};

export default PaymentTestPage;
