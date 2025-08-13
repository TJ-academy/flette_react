import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/FlowerDetail.css";
import { useFlowerDetail, useFlowerList } from "./FlowerHooks";

const IMAGE_BASE = "http://localhost/img/flower";

const CATEGORY_FOLDER = {
  "메인": "main",
  "서브": "sub",
  "잎사귀": "foliage"
};

const CATEGORY_EN = {
  "메인": "MAIN",
  "서브": "SUB",
  "잎사귀": "FOLIAGE"
};

export default function FlowerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFlowerDetail(id);
  const { data: listData } = useFlowerList();

  if (loading) return <p>로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>오류: {error}</p>;
  if (!data) return null;

  const folder = CATEGORY_FOLDER[data.category] || "main";
  const mappedName = data.imageName;
  const imgSrc = `${IMAGE_BASE}/${folder}/${mappedName}`;

  const currentIndex = listData
    ? listData.findIndex((f) => String(f.flowerId) === String(id))
    : -1;

  const goPrev = () => {
    if (!listData || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + listData.length) % listData.length;
    navigate(`/flower/${listData[prevIndex].flowerId}`);
  };

  const goNext = () => {
    if (!listData || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % listData.length;
    navigate(`/flower/${listData[nextIndex].flowerId}`);
  };

  return (
    <div className="flower-detail">
      <div className="flower-detail-image">
        <button className="nav-btn left" onClick={goPrev}>‹</button>
        <img src={imgSrc} alt={data.flowerName} />
        <button className="nav-btn right" onClick={goNext}>›</button>
      </div>

      <div className="flower-detail-info">
        {/* 카테고리 영어 대문자로 표시 */}
        <span className="category">
          {CATEGORY_EN[data.category] || data.category}
        </span>
        <h1>{data.flowerName}</h1>

        {/* 판매 상태 표시 */}
        <div className="status">
          {data.show
            ? <span className="status-on">판매 중</span>
            : <span className="status-off">Sold Out</span>}
        </div>

        {/* 구분선 */}
        <hr className="pink-line long-line" />

        {/* 소개 */}
        <div className="flower-section">
          <h4>소개</h4>
          <p dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>

        {/* 회색 구분선 */}
        <hr className="gray-line" />

        {/* 꽃말 */}
        <div className="flower-section">
          <p dangerouslySetInnerHTML={{ __html: data.story }} />
        </div>
      </div>

      {/* 구분선 */}
      <hr className="pink-line long-line" style={{ marginTop: "30px" }} />

      {/* 뒤로가기 버튼 */}
      <button className="back-btn" onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
}
