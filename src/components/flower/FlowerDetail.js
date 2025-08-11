import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/FlowerDetail.css";
import imageNameMap from "../../image-name-map.json";
import { useFlowerDetail, useFlowerList } from "./FlowerHooks"; // 훅 분리

const CATEGORY_FOLDER = {
  "메인": "main",
  "서브": "sub",
  "잎사귀": "foliage"
};

const IMAGE_BASE = process.env.PUBLIC_URL + "/img/flower";

export default function FlowerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFlowerDetail(id);
  const { data: listData } = useFlowerList();

  if (loading) return <p>로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>오류: {error}</p>;
  if (!data) return null;

  const folder = CATEGORY_FOLDER[data.category] || "main";
  const mappedName = imageNameMap[data.imageName] || data.imageName;
  const imgSrc = `${IMAGE_BASE}/${folder}/${mappedName}`;

  // 현재 index 찾기
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
        <span className="category">{data.category}</span>
        <h1>{data.flowerName}</h1>
        <hr className="pink-line" />
        <p className="description">{data.description}</p>
        <p className="story">{data.story}</p>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
}
