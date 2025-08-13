import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/FlowerDetail.css";
import { useFlowerDetail, useFlowerList } from "./FlowerHooks"; // 훅 분리

// IMAGE_BASE 경로를 백엔드 서버의 정적 파일 경로로 수정
const IMAGE_BASE = "http://localhost/img/flower"; // 백엔드 API가 있는 곳의 도메인 + 경로

const CATEGORY_FOLDER = {
  "메인": "main",
  "서브": "sub",
  "잎사귀": "foliage"
};

// 카테고리 한글 → 영어 대문자 매핑
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
  // imageNameMap을 사용하지 않고 data.imageName을 직접 사용
  const mappedName = data.imageName;
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
        {/* 카테고리 영어 대문자로 표시 */}
        <span className="category">
          {CATEGORY_EN[data.category] || data.category}
        </span>
        <h1>{data.flowerName}</h1>

        {/* 구분선 길이 늘림 */}
        <hr className="pink-line long-line" />

        <p className="description">{data.description}</p>
        <p className="story">{data.story}</p>
      </div>

      {/* 뒤로 가기 버튼 위에 구분선 추가 */}
      <hr className="pink-line long-line" style={{ marginTop: "30px" }} />

      {/* 뒤로가기 버튼 */}
      <button className="back-btn" onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
}