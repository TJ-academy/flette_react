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
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleChange}
              onClick={e => e.stopPropagation()} // 체크박스 클릭 시 이벤트 버블링 막기
            />
            {/* <img src={`/images/${item.imageName}`} alt={item.flowerName || item.decorationName} /> */}
            <div><strong>{item.flowerName || item.decorationName}</strong></div>
            <div>{item.description}</div>
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
    additional: 4,
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

  return (
    <>
      <div className="shop-info-container">
          <p>{lists.dto?.description || "로딩 중"}</p>
      </div>

      <hr />

      <div className="info-menu">
          <p><strong>MAIN</strong> {guide.main?.label} ({guide.main?.count})</p>
          <ItemGrid
            list={lists.mfl}
            type="flower"
            selectedItems={selected.main}
            maxSelect={categoryMax.main}
            onSelect={(id, selected) => handleSelect("main", id, selected)}
          />

          <p><strong>SUB</strong> {guide.sub?.label} ({guide.sub?.count})</p>
          <ItemGrid
            list={lists.sfl}
            type="flower"
            selectedItems={selected.sub}
            maxSelect={categoryMax.sub}
            onSelect={(id, selected) => handleSelect("sub", id, selected)}
          />

          <p><strong>FOLIAGE</strong> {guide.foliage?.label} ({guide.foliage?.count})</p>
          <ItemGrid
            list={lists.ffl}
            type="flower"
            selectedItems={selected.foliage}
            maxSelect={categoryMax.foliage}
            onSelect={(id, selected) => handleSelect("foliage", id, selected)}
          />

          <p><strong>WRAPPING</strong> 택 1</p>
          <ItemGrid
            list={lists.wdl}
            type="deco"
            selectedItems={selected.wrapping}
            maxSelect={categoryMax.wrapping}
            onSelect={(id, selected) => handleSelect("wrapping", id, selected)}
          />

          <p><strong>ADDITIONAL</strong> 다중 선택 가능</p>
          <ItemGrid
            list={lists.adl} type="deco"
            selectedItems={selected.additional}
            maxSelect={categoryMax.additional}
            onSelect={(id, selected) => handleSelect("additional", id, selected)}
          />
      </div>

      <hr />

      {/* 총 가격 & 버튼 */}
      <div className="total-section">
          <div><strong>총 상품금액: </strong>0원</div>
          <button className="btn-cart">장바구니</button>
          <button className="btn-buy">구매하기</button>
      </div>

      <style>{`
        .item-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .item-card {
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px;
          text-align: center;
          transition: border-color 0.2s ease;
          user-select: none;
        }
        .item-card.selected {
          border: 2px solid #F2778C;
        }
        .item-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .item-card input[type="checkbox"] {
          margin-bottom: 6px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ShopInfo;