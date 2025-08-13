// src/components/shop/ReviewsIndex.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/ReviewsIndex.css";

const PAGE_SIZE = 8;

export default function ReviewsIndex() {
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [reviews, setReviews] = useState([
    {
      reviewId: 1,
      score: 4,
      writer: "user123",
      reviewContent:
        "정말 좋았습니다! 다시 방문할게요. 가격도 적당하고 품질이 좋아서 만족합니다.",
      reviewDate: "2025-08-12",
      reviewImage: null,
      likes: 5,
    },
    {
      reviewId: 2,
      score: 5,
      writer: "flowerlover",
      reviewContent:
        "꽃이 너무 예쁘고 포장도 깔끔했어요. 사장님이 친절해서 기분 좋게 구매했습니다.",
      reviewDate: "2025-08-10",
      reviewImage: null,
      likes: 10,
    },
  ]);

  const StarRating = ({ rating, max = 5 }) => (
    <div style={{ color: "#FFD700" }}>
      {[...Array(max)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  const maskId = (id) =>
    id.length <= 3 ? id + "***" : id.slice(0, 3) + "*".repeat(id.length - 3);

  const onLike = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.reviewId === id ? { ...r, likes: r.likes + 1 } : r
      )
    );
  };

  const onExpandToggle = (id) => {
    setExpandedReviewId((prevId) => (prevId === id ? null : id));
  };

  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === "rating") arr.sort((a, b) => b.score - a.score);
    else if (sort === "likes") arr.sort((a, b) => b.likes - a.likes);
    else arr.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
    return arr;
  }, [reviews, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, currentPage]);

  const Card = ({ review }) => {
    const isExpanded = expandedReviewId === review.reviewId;
    const shortText =
      review.reviewContent.length > 100 && !isExpanded
        ? review.reviewContent.slice(0, 100) + "..."
        : review.reviewContent;

        return (
          <article className="rv-card">
            {/* 이미지 */}
            <div className="rv-thumb-wrap">
              <img
                src={
                  review.productImageUrl || // ✅ 상품 이미지 우선
                  review.reviewImage ||     // 리뷰 이미지 없으면
                  "https://picsum.photos/seed/product/600/400" // 마지막 fallback
                }
                alt={review.reviewId}
                className="rv-thumb"
              />
              <div className="rv-thumb-overlay">
                {/* 돋보기 클릭 시 상세로 이동 */}
                <Link
                  to={`/mypage/review/detail/${review.reviewId}`}
                  className="rv-zoom"
                  aria-label="리뷰 상세 보기"
                  style={{ textDecoration: "none" }}
                >
                  🔍
                </Link>
              </div>
            </div>
        
        {/* 내용 */}
        <div className="rv-body">
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <StarRating rating={review.score} />
            <span>{review.score}점</span>
          </div>

          <div className="rv-meta">
            <span className="rv-meta-dim">
              {maskId(review.writer)} | {review.reviewDate}
            </span>
          </div>

          <p className="rv-text" onClick={() => onExpandToggle(review.reviewId)}>
            {shortText}
            {review.reviewContent.length > 100 && (
              <span style={{ color: "gray" }}>
                {isExpanded ? " 간략히 보기" : " ...자세히 보기"}
              </span>
            )}
          </p>

          {/* 상품 썸네일 + 좋아요 */}
          <div className="rv-foot">
          <img
  className="rv-avatar"
  src={
    review.productImageUrl || 
    review.reviewImage ||     
    "https://picsum.photos/seed/productthumb/50/50" 
  }
  alt="상품 썸네일"
/>

            <button
              onClick={() => onLike(review.reviewId)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              👍 {review.likes}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="rv-page">
      <section className="rv-hero">
        <img
          src="/img/reviews/reviews.png"
          alt="Photo Reviews"
          className="rv-hero-img"
        />
      </section>

      {/* 툴바 */}
      <div className="rv-toolbar">
        <div />
        <label className="rv-select-wrap">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rv-select"
          >
            <option value="latest">최신순</option>
            <option value="rating">별점 높은순</option>
            <option value="likes">좋아요 많은순</option>
          </select>
          <span className="rv-caret">▾</span>
        </label>
      </div>

      {/* 리뷰 카드 */}
      <section className="rv-grid">
        {paged.map((r) => (
          <Card key={r.reviewId} review={r} />
        ))}
      </section>

      {/* 페이지네이션 */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={(p) => setPage(p)}
      />
    </main>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [...Array(totalPages)].map((_, i) => i + 1);
  return (
    <nav className="rv-pagination">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rv-page-btn ${p === page ? "is-active" : ""}`}
        >
          {p}
        </button>
      ))}
    </nav>
  );
}
