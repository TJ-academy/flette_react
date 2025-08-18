import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link, useParams, useNavigate} from 'react-router-dom';

function ItemGrid({ list = [], selectedItems, onSelect, maxSelect, type }) {
  return (
    <div className="item-grid">
      {list.map(item => {
        const id = item.flowerId || item.decorationId;
        const isSelected = selectedItems.includes(id);

        const handleChange = () => {
          if (isSelected) {
            onSelect(id, false);
          } else {
            if (selectedItems.length < maxSelect) {
              onSelect(id, true);
            } else {
              alert(`최대 ${maxSelect}개까지 선택 가능합니다.`);
            }
          }
        };

        return (
          <div
            key={id}
            className={`item-card ${isSelected ? "selected" : ""}`}
            onClick={handleChange}
          >
            <div><input
              type="checkbox"
              checked={isSelected}
              onChange={handleChange}
              onClick={e => e.stopPropagation()} // 체크박스 클릭 시 이벤트 버블링 막기
            /></div>
            <div><img src={`http://localhost:80/img/${type}/${item.imageName}`} alt={item.flowerName || item.decorationName} /></div>
            <div><strong>{item.flowerName || item.decorationName}</strong></div>
            <div>{item.description || "\u00A0"}</div>
            <div>
                {(item.addPrice || item.utilPrice) 
                ? "+" + (item.addPrice || item.utilPrice).toLocaleString() : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ShopInfo() {
  const [lists, setLists] = useState([]);
  const {productId} = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState({
    main: [],
    sub: [],
    foliage: [],
    wrapping: [],
    additional: [],
  });

  const selectionGuide = {
    1: {
      main: { label: "택 1", count: "2~3송이" },
      sub: { label: "택 1", count: "2~3송이" },
      foliage: { label: "택 1", count: "1송이" },
    },
    2: {
      main: { label: "택 2", count: "4~6송이" },
      sub: { label: "택 2", count: "2~4송이" },
      foliage: { label: "택 2", count: "2송이" },
    },
    3: {
      main: { label: "택 3", count: "7~10송이" },
      sub: { label: "택 3", count: "3~6송이" },
      foliage: { label: "택 3", count: "3송이 이상" },
    },
  };
  const guide = selectionGuide[parseInt(productId)] || {};

  const categoryMax = {
    main: parseInt(productId),
    sub: parseInt(productId),
    foliage: parseInt(productId),
    wrapping: 1,
    additional: 3,
  };

  const handleSelect = (category, id, isSelected) => {
    setSelected(prev => {
      let updated = [...prev[category]];
      if (isSelected) {
        updated.push(id);
      } else {
        updated = updated.filter(itemId => itemId !== id);
      }
      return { ...prev, [category]: updated };
    });
  };

  const loadLists = async () => {
      try {
        const res = await axios.get(`http://localhost/api/shop/${productId}/info`);
        setLists(res.data);
      } catch (error) {
        console.error("API 호출 에러:", error);
        setLists({});  // 빈값 처리하거나 에러 상태 표시용
      }
  };

  useEffect(() => {
      loadLists();
  }, []);

  const basePrice = lists.dto?.basicPrice || 0;

    // 모든 아이템을 하나의 배열로 병합
  const allItems = [
    ...(lists.mfl || []),
    ...(lists.sfl || []),
    ...(lists.ffl || []),
    ...(lists.wdl || []),
    ...(lists.adl || []),
  ];

  // 선택된 ID들
  const selectedIds = [
    ...selected.main,
    ...selected.sub,
    ...selected.foliage,
    ...selected.wrapping,
    ...selected.additional,
  ];

  // 선택된 항목들의 가격 합산
  const extraPrice = allItems.reduce((sum, item) => {
    const id = item.flowerId || item.decorationId;
    if (selectedIds.includes(id)) {
      return sum + (item.addPrice || item.utilPrice || 0);
    }
    return sum;
  }, 0);

  const totalPrice = basePrice + extraPrice;

  const bouquetInsert = async () => {
      const main = selected.main.filter(Boolean).sort((a, b) => a - b);
      const sub = selected.sub.filter(Boolean).sort((a, b) => a - b);
      const foliage = selected.foliage.filter(Boolean).sort((a, b) => a - b);
      const wrapping = selected.wrapping;
      const additional = selected.additional;

      // 유효성 검사
      if (!main[0]) {
        alert("Main 꽃을 최소 1개 선택해주세요.");
        return null;
      }
      if (!sub[0]) {
        alert("Sub 꽃을 최소 1개 선택해주세요.");
        return null;
      }
      if (!foliage[0]) {
        alert("Foliage(잎) 항목을 최소 1개 선택해주세요.");
        return null;
      }
      if (!wrapping[0]) {
        alert("포장지를 1개 선택해주세요.");
        return null;
      }

      const payload = {
          productId: parseInt(productId),
          totalMoney: totalPrice,

          mainA: main[0],
          mainB: main[1] || 0,
          mainC: main[2] || 0,

          subA: sub[0],
          subB: sub[1] || 0,
          subC: sub[2] || 0,

          leafA: foliage[0],
          leafB: foliage[1] || 0,
          leafC: foliage[2] || 0,

          addA: additional[0] || 0,
          addB: additional[1] || 0,
          addC: additional[2] || 0,

          wrapping: wrapping[0]
      };
      try {
        const res = await axios.post(`http://localhost/api/shop/${productId}/bouquet/insert`, payload)
        if(res.data.success) {
          console.log("꽃다발 저장 성공: ");
          return res.data;
        } else {
          console.log("꽃다발 저장 실패: " + res.data.message);
          return null;
        }
      } catch (e) {
        alert("꽃다발 저장 중 에러 발생");
        return null;
      }
  };

  const handleCart = async () => {
    const loginId = sessionStorage.getItem('loginId') || null;
    console.log("로그인했나요? => " + loginId);
    if(loginId === null) {
      const goLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인하겠습니까?");
      if(goLogin) {
        navigate("/member/login");
      }
    } else {
      const bouquetData = await bouquetInsert();
      if(!bouquetData) return;

      try {
        const payload = {
          bouquetCode: bouquetData.bouquetCode,
          price: bouquetData.totalMoney,
          quantity: 1,
          totalPrice: bouquetData.totalMoney,
          userid: loginId,
        };
        const res = await axios.post(`http://localhost/api/cart/insert`, payload)
        if(res.data.success) {
          console.log("장바구니에 추가되었습니다.");
          navigate("/cart/list");
        } else {
          console.log("장바구니 추가 실패: " + res.data.message);
          return null;
        }
      } catch (e) {
        console.log("장바구니 저장 중 오류 발생");
        return null;
      }
    }
  };

  return (
    <>
      <div className="shop-info-container">
          <p>{lists.dto?.description || "로딩 중"}</p>
      </div>

      <hr />

      <div className="info-menu">
          <div className="info-item">
            <p><strong>MAIN</strong> {guide.main?.label} ({guide.main?.count})</p>
            <ItemGrid
              list={lists.mfl}
              type="flower/main"
              selectedItems={selected.main}
              maxSelect={categoryMax.main}
              onSelect={(id, selected) => handleSelect("main", id, selected)}
            />
          </div>

          <div className="info-item">
            <p><strong>SUB</strong> {guide.sub?.label} ({guide.sub?.count})</p>
            <ItemGrid
              list={lists.sfl}
              type="flower/sub"
              selectedItems={selected.sub}
              maxSelect={categoryMax.sub}
              onSelect={(id, selected) => handleSelect("sub", id, selected)}
            />
          </div>

          <div className="info-item">
            <p><strong>FOLIAGE</strong> {guide.foliage?.label} ({guide.foliage?.count})</p>
            <ItemGrid
              list={lists.ffl}
              type="flower/foliage"
              selectedItems={selected.foliage}
              maxSelect={categoryMax.foliage}
              onSelect={(id, selected) => handleSelect("foliage", id, selected)}
            />
          </div>

          <div className="info-item">
            <p><strong>WRAPPING</strong> 택 1</p>
            <ItemGrid
              list={lists.wdl}
              type="decoration/wrapping"
              selectedItems={selected.wrapping}
              maxSelect={categoryMax.wrapping}
              onSelect={(id, selected) => handleSelect("wrapping", id, selected)}
            />
          </div>

          <div className="info-item">
            <p><strong>ADDITIONAL</strong> 다중 선택 가능</p>
            <ItemGrid
              list={lists.adl} type="decoration/additional"
              selectedItems={selected.additional}
              maxSelect={categoryMax.additional}
              onSelect={(id, selected) => handleSelect("additional", id, selected)}
            />
          </div>
      </div>

      <hr />

      {/* 총 가격 & 버튼 */}
      <div className="total-section">
          <div className="total-price">
            <span className="price-label">총 상품금액:</span>
            <span className="price-value">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <button className="btn-cart" onClick={handleCart}>장바구니</button>
          <button className="btn-buy" onClick={bouquetInsert}>구매하기</button>
      </div>

      <style>{`
        .shop-info-container {
          text-align: center;
          margin: 60px 0;
        }
        .info-menu {
          margin-top: 80px;
          padding: 20px;
        }
        .info-item {
          margin-bottom : 100px;
        }
        .item-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .item-card {
          cursor: pointer;
          height: 300px;
          border: 1px solid #ffffff;
          border-radius: 20px;
          padding: 10px;
          text-align: center;
          user-select: none;
        }
        .item-card:hover {
          border: 1px solid #F2778C;
        }
        .item-card.selected {
          border: 1px solid #F2778C;
        }
        .item-card img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .item-card input[type="checkbox"] {
          margin-bottom: 10px;
          cursor: pointer;
        }
        .total-section {
          text-align: center;
          margin: 30px 0;
        }
        .total-price {
          margin-bottom: 30px;
        }
        .price-label {
          font-size: 24px;
          color: #584245;
          font-weight: 500;
          margin-right: 10px;
        }
        .price-value {
          font-size: 32px;
          color: #F2778C;
          font-weight: bold;
        }
        .btn-cart, .btn-buy {
          width: 259px;
          height: 48px;
          border: 1px solid #AEAEAE;
          border-radius: 25px;
          background: white;
          font-size: 18px;
          font-weight: bold;
          color: #584245;
          margin: 0px 10px 30px 10px;
        }
        .btn-cart:hover, .btn-buy:hover {
          border: 1px solid #F2778C;
          background: #F2778C;
          color: #FFFFFF;
        }
      `}</style>
    </>
  );
};

export default ShopInfo;