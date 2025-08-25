import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import BouquetInfoList from '../cart/BouquetInfoList';
import '../../css/orders/order.css';

const getMerchantUid = () => `mid_${uuidv4()}`;

const Order = () => {
  const userid = sessionStorage.getItem('loginId');
  const { orderId } = useParams();

  const [orderTable, setOrderTable] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  const [receiver, setReceiver] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [phone, setPhone] = useState('');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');

  const navigate = useNavigate();
  const [status, setStatus] = useState("결제 대기 중");

  const loadOrderItems = async () => {
    try {
      const res = await axios.get(`http://localhost/api/orders/${orderId}`);
      setDetailList(res.data.detailList);
      setOrderTable(res.data.order);
      setUserInfo(res.data.userInfo);
    } catch (error) {
      console.error("API 호출 에러:", error);
    }
  };

  const handleBack = async () => {
    const confirmed = window.confirm("주문을 취소하고 돌아가시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost/api/orders/${orderId}`);
      navigate(-1);
    } catch (error) {
      console.error("주문 삭제 실패:", error);
    }
  };

  const loadMyInfo = () => {
    setReceiver(userInfo.username);
    setAddress1(`(${userInfo.zipcode}) ${userInfo.address1}`);
    setAddress2(userInfo.address2);
    setPhone(userInfo.tel);
  };

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        if (data.userSelectedType === 'R' && data.bname) {
          addr += ` (${data.bname})`;
        }
        setZipcode(data.zonecode);
        setAddress1(`(${data.zonecode}) ${addr}`);
        setAddress2('');
      },
    }).open();
  };

  const handleSubmit = async () => {
    if (!receiver || !address1 || !address2 || !phone) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }
    if (!bank || !account) {
      alert("환불 계좌 정보를 모두 입력해주세요.");
      return;
    }

    const payload = {
      orderId,
      userid,
      receiver,
      orderAddress: `${address1} ${address2}`,
      tel: phone,
      bank,
      account,
      merchantUid: getMerchantUid(),
    };
    console.log("\npayload: " + JSON.stringify(payload, null, 2));

    try {
      setStatus("결제 준비 중...");

      // 1) 결제 사전 등록
      const prepareResponse = await axios.post('/api/orders/prepare', payload);
      const merchantUid = prepareResponse.data;

      const firstItemName = detailList[0]?.productName ?? '주문상품';
      const itemCount = detailList.length;
      const productName =
        itemCount > 1 ? `${firstItemName} 외 ${itemCount - 1}건` : firstItemName;

      // 2) 아임포트 결제
      const { IMP } = window;
      IMP.init("imp58115315");

      IMP.request_pay(
        {
          pg: 'kakaopay',
          pay_method: 'card',
          merchant_uid: merchantUid,
          name: productName,
          amount: orderTable.totalMoney,
          buyer_name: userInfo.username,
          app_scheme: 'flette_payment',
          m_redirect_url: "http://localhost:3000/orders/success",
        },
        async (rsp) => {
          if (rsp.success) {
            try {
              setStatus("결제 성공. 백엔드 검증 시작...");
              // 3) 결제 검증
              const verifyResponse = await axios.post('/api/orders/verify', {
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
              });

              if (verifyResponse.status === 200) {
                setStatus("결제 및 백엔드 검증 완료!");
                navigate(`/orders/success`);
              } else {
                setStatus("백엔드 검증 실패");
                console.log("결제는 성공했지만, 백엔드 검증에 실패했습니다.");
              }
            } catch (error) {
              setStatus("백엔드 검증 중 오류 발생");
              console.error("서버 응답 중 문제 발생:\n", error);
            }
          } else {
            setStatus(`결제 실패: ${rsp.error_msg}`);
            console.log(`결제 실패: ${rsp.error_msg}`);
          }
        }
      );
    } catch (error) {
      setStatus("결제 요청 실패");
      console.log("결제 요청 중 오류 발생: " + error.message);
    }
  };

  useEffect(() => {
    loadOrderItems();

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

  return (
    <>
      <div className="order-page">
        <button className="back-button" onClick={handleBack}>
          ‹ 
        </button>

        {/* 주문 상품 박스 */}
        <div className="box">
          <h2>주문상품</h2>
          {detailList.map((item) => (
            <div key={item.id} className="order-item">
              <img
                src={`http://localhost:80/img/product/${item.imageName}`}
                alt={item.productName}
              />
              <div className="item-info">
                <div>{item.productName}</div>
                <div>
                  <BouquetInfoList bouquetInfoList={item.bouquetInfoList} />
                </div>
              </div>
            </div>
          ))}

          <div className="order-price">
            주문 금액: {orderTable.money?.toLocaleString() ?? '??'}원
          </div>
          <div className="delivery">
            배달비: {orderTable.delivery?.toLocaleString() ?? '??'}원
          </div>

          {/* ✅ 총 결제 금액 중앙 강조 */}
          <div className="order-total">
            총 결제 금액&nbsp;
            <span className="order-total-value">
              {orderTable.totalMoney?.toLocaleString() ?? '??'}원
            </span>
          </div>
        </div>

        {/* 배송지 박스 */}
        <div className="box">
          <div className="section-header">
            <h2>배송지</h2>
            <button onClick={loadMyInfo}>내 정보 불러오기</button>
          </div>

          <div className="input-group">
            <label>이름</label>
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>주소</label>
            <div className="inline-input">
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
                readOnly
              />
              <button type="button" onClick={handlePostcodeSearch}>
                우편번호 검색
              </button>
            </div>
          </div>

          <div className="input-group">
            <label></label>
            <input
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="상세 주소"
              required
            />
          </div>

          <div className="input-group">
            <label>전화번호</label>
            <div className="inline-input phone-input">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                required
              />
            </div>
          </div>
        </div>

        {/* 결제 수단 박스 */}
        <div className="box">
          <h2>결제 수단</h2>
          <div className="input-group">
            <label>
              <input type="checkbox" checked readOnly />
              <span style={{ marginLeft: '5px'}}>카카오페이</span>
            </label>
          </div>

          <div className="input-group">
            <label>환불 계좌</label>
            <select value={bank} onChange={(e) => setBank(e.target.value)}>
              <option value="">은행 선택</option>
              <option value="국민은행">국민은행</option>
              <option value="신한은행">신한은행</option>
              <option value="농협">농협</option>
              <option value="기업은행">기업은행</option>
            </select>
          </div>

          <div className="input-group">
            <label>계좌번호</label>
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="숫자만 입력"
            />
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          결제하기
        </button>
      </div>
    </>
  );
};

export default Order;
