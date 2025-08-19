import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/shop/shopinfo.css";

// 아이템 카드 컴포넌트 (슬라이드 적용)
function ItemSlider({ list = [], selectedItems, onSelect, maxSelect, type }) {
  const sliderRef = useRef(null);

  const slide = (direction) => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -width : width,
        behavior: "smooth",
      });
    }
  };

// (변경된 부분만)
return (
  <div className="item-slider-container">
    <button className="slide-btn left" onClick={() => slide("left")}>‹</button>

    <div className="item-slider" ref={sliderRef}>
      {list.map((item) => {
        const id = item.flowerId || item.decorationId;
        const isSelected = selectedItems.includes(id);

        const handleChange = () => {
          if (isSelected) {
            onSelect(id, false);
          } else {
            if (selectedItems.length < maxSelect) onSelect(id, true);
            else alert(`최대 ${maxSelect}개까지 선택 가능합니다.`);
          }
        };

        return (
          <div
            key={id}
            className={`item-card ${isSelected ? "selected" : ""}`}
            onClick={handleChange}
          >
            {/* ✅ 동그라미 토글 표시 (체크박스 대체) */}
            <span
              className={`select-dot ${isSelected ? "on" : ""}`}
              aria-hidden="true"
            />

            <img
              src={`http://localhost:80/img/${type}/${item.imageName}`}
              alt={item.flowerName || item.decorationName}
            />
            <strong>{item.flowerName || item.decorationName}</strong>
            <p>{item.description || "\u00A0"}</p>
            <span className="price">
              {(item.addPrice || item.utilPrice)
                ? `+${(item.addPrice || item.utilPrice).toLocaleString()}원`
                : ""}
            </span>
          </div>
        );
      })}
    </div>

    <button className="slide-btn right" onClick={() => slide("right")}>›</button>
  </div>
);

  
}

function ShopInfo() {
  const [lists, setLists] = useState({});
  const { productId } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState({
    main: [],
    sub: [],
    foliage: [],
    wrapping: [],
    additional: [],
  });

  // 사이즈별 선택 가이드
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

  // 카테고리별 최대 선택 갯수
  const categoryMax = {
    main: parseInt(productId),
    sub: parseInt(productId),
    foliage: parseInt(productId),
    wrapping: 1,
    additional: 3,
  };

  const handleSelect = (category, id, isSelected) => {
    setSelected((prev) => {
      const updated = isSelected
        ? [...prev[category], id]
        : prev[category].filter((itemId) => itemId !== id);
      return { ...prev, [category]: updated };
    });
  };

  const loadLists = async () => {
    try {
      const res = await axios.get(
        `http://localhost/api/shop/${productId}/info`
      );
      setLists(res.data);
    } catch (error) {
      console.error("API 호출 에러:", error);
      setLists({});
    }
  };

  useEffect(() => {
    loadLists();
  }, [productId]);

  const basePrice = lists.dto?.basicPrice || 0;
  const allItems = [
    ...(lists.mfl || []),
    ...(lists.sfl || []),
    ...(lists.ffl || []),
    ...(lists.wdl || []),
    ...(lists.adl || []),
  ];
  const selectedIds = [
    ...selected.main,
    ...selected.sub,
    ...selected.foliage,
    ...selected.wrapping,
    ...selected.additional,
  ];
  const extraPrice = allItems.reduce((sum, item) => {
    const id = item.flowerId || item.decorationId;
    return selectedIds.includes(id)
      ? sum + (item.addPrice || item.utilPrice || 0)
      : sum;
  }, 0);
  const totalPrice = basePrice + extraPrice;

  // 꽃다발 저장
  const bouquetInsert = async () => {
    const { main, sub, foliage, wrapping, additional } = selected;
    if (!main[0]) return alert("Main 꽃을 최소 1개 선택해주세요.");
    if (!sub[0]) return alert("Sub 꽃을 최소 1개 선택해주세요.");
    if (!foliage[0]) return alert("Foliage 항목을 최소 1개 선택해주세요.");
    if (!wrapping[0]) return alert("포장지를 1개 선택해주세요.");

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
      wrapping: wrapping[0],
    };

    try {
      const res = await axios.post(
        `http://localhost/api/shop/${productId}/bouquet/insert`,
        payload
      );
      return res.data.success ? res.data : null;
    } catch (e) {
      console.error("꽃다발 저장 중 에러:", e);
      return null;
    }
  };

  // 장바구니 추가
  const handleCart = async () => {
    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인하겠습니까?")) {
        navigate("/member/login");
      }
      return;
    }

    const bouquetData = await bouquetInsert();
    if (!bouquetData) return;

    try {
        const payload = {
          bouquetCode: bouquetData.bouquetCode,
          price: bouquetData.totalMoney,
          quantity: 1,
          // totalPrice: bouquetData.totalMoney,
          userid: loginId,
        };
        const res = await axios.post(`http://localhost/api/cart/insert`, payload)
        if(res.data.success) {
          console.log("장바구니에 추가되었습니다.");
          navigate("/cart");
        } else {
          console.log("장바구니 추가 실패: " + res.data.message);
          return null;
        }
    } catch (e) {
      console.log("장바구니 저장 중 오류 발생");
      return null;
    }
  };

  // 바로 구매
  const handleBuy = async () => {
    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인하겠습니까?")) {
        navigate("/member/login");
      }
      return;
    }

    const bouquetData = await bouquetInsert();
    if (bouquetData) {
      navigate(`/order/checkout?bouquetCode=${bouquetData.bouquetCode}`);
    }
  };

  return (
    <>
      <div className="shop-info-container">
        <p>{lists.dto?.description || "로딩 중..."}</p>
      </div>

      <hr />

      <div className="info-menu">
      <div className="info-item">
  <p>
    <span className="main-label">MAIN</span>
    <span className="main-desc"> {guide.main?.label} ({guide.main?.count})</span>
  </p>
  <ItemSlider
    list={lists.mfl}
    type="flower/main"
    selectedItems={selected.main}
    maxSelect={categoryMax.main}
    onSelect={(id, s) => handleSelect("main", id, s)}
  />
</div>

<div className="info-item">
  <p>
    <span className="main-label">SUB</span>
    <span className="main-desc"> {guide.sub?.label} ({guide.sub?.count})</span>
  </p>
  <ItemSlider
    list={lists.sfl}
    type="flower/sub"
    selectedItems={selected.sub}
    maxSelect={categoryMax.sub}
    onSelect={(id, s) => handleSelect("sub", id, s)}
  />
</div>

<div className="info-item">
  <p>
    <span className="main-label">FOLIAGE</span>
    <span className="main-desc"> {guide.foliage?.label} ({guide.foliage?.count})</span>
  </p>
  <ItemSlider
    list={lists.ffl}
    type="flower/foliage"
    selectedItems={selected.foliage}
    maxSelect={categoryMax.foliage}
    onSelect={(id, s) => handleSelect("foliage", id, s)}
  />
</div>

<div className="info-item">
  <p>
    <span className="main-label">WRAPPING</span>
    <span className="main-desc"> 택 1</span>
  </p>
  <ItemSlider
    list={lists.wdl}
    type="decoration/wrapping"
    selectedItems={selected.wrapping}
    maxSelect={categoryMax.wrapping}
    onSelect={(id, s) => handleSelect("wrapping", id, s)}
  />
</div>

<div className="info-item">
  <p>
    <span className="main-label">ADDITIONAL</span>
    <span className="main-desc"> 다중 선택 가능</span>
  </p>
  <ItemSlider
    list={lists.adl}
    type="decoration/additional"
    selectedItems={selected.additional}
    maxSelect={categoryMax.additional}
    onSelect={(id, s) => handleSelect("additional", id, s)}
  />
</div>
</div>

      <hr />

      <div className="total-section">
        <div className="total-price">
          <span className="price-label">총 상품금액</span>
          <span className="price-value">{totalPrice.toLocaleString()}원</span>
        </div>
        <button className="btn-cart" onClick={handleCart}>
          장바구니
        </button>
        <button className="btn-buy" onClick={handleBuy}>
          구매하기
        </button>
      </div>
    </>
  );
}

export default ShopInfo;
