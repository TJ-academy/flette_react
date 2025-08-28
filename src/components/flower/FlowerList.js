import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ZoomIn } from "lucide-react";
import "../../css/FlowerList.css";
import imageNameMap from "../../image-name-map.json";
import { useFlowerList } from "./FlowerHooks";

const CATEGORY_FOLDER = {
  "메인": "main",
  "서브": "sub",
  "잎사귀": "foliage"
};

// UI에 표시할 영어 텍스트
const TAB_LABELS = {
  MAIN: "MAIN",
  SUB: "SUB",
  FOLIAGE: "FOLIAGE"
};

// API 데이터에서 필터링에 쓸 한글 매핑
const TAB_TO_KOR = {
  MAIN: "메인",
  SUB: "서브",
  FOLIAGE: "잎사귀"
};

// IMAGE_BASE 경로를 백엔드 서버의 정적 파일 경로로 수정
const IMAGE_BASE = "https://sure-dyane-flette-f3f77cc0.koyeb.app/img/flower";

export function FlowerList() {
  const { data, loading, error } = useFlowerList();
  const [tab, setTab] = useState("MAIN");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    const kor = TAB_TO_KOR[tab];
    return (data || []).filter((f) => f.category === kor);
  }, [data, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [tab]);

  return (
    <div className="flower-container">
      <header className="flower-header">꽃 알아보기</header>
      <div className="flower-tabs">
        {Object.entries(TAB_LABELS).map(([eng, label]) => (
          <button
            key={eng}
            onClick={() => setTab(eng)}
            className={`flower-tab ${tab === eng ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="flower-grid">
          {pageItems.map((f) => (
            <FlowerCard key={f.flowerId} f={f} />
          ))}
          {pageItems.length === 0 && <p>No items to display</p>}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                className={page === n ? "active" : ""}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FlowerCard({ f }) {
  const folder = CATEGORY_FOLDER[f.category] || "main";
  const mappedName = f.imageName; // imageNameMap을 사용하지 않으므로, f.imageName을 직접 사용합니다.
  const imgSrc = `${IMAGE_BASE}/${folder}/${mappedName}`;

  return (
    <Link to={`/flower/${f.flowerId}`} className="flower-card">
      <img src={imgSrc} alt={f.flowerName} />
      <div className="flower-overlay">
        <div className="flower-icon">
          <ZoomIn color="white" size={20} />
        </div>
        <p className="flower-name">{f.flowerName}</p>
        <p className="flower-desc">{f.description}</p>
      </div>
    </Link>
  );
}
