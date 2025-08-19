import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../css/ReviewsIndex.css"; // 스타일 시트 파일

const PAGE_SIZE = 8;

export default function ReviewsIndex() {
  const [sort, setSort] = useState("latest"); // 최신순, 별점순, 좋아요순 등으로 정렬
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  // 리뷰 데이터를 가져오는 useEffect
  useEffect(() => {
    axios
      .get(`http://localhost/api/all/reviews?page=${page}&size=${PAGE_SIZE}`)
      .then((response) => {
        setReviews(response.data.content); // 리뷰 목록
        setTotalPages(response.data.totalPages); // 전체 페이지 수
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [page]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 리뷰 정렬 로직
  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === "rating") arr.sort((a, b) => b.score - a.score);
    else if (sort === "likes") arr.sort((a, b) => b.luv - a.luv);
    else arr.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
    return arr;
  }, [reviews, sort]);

  const onLike = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.reviewId === id ? { ...r, luv: r.luv + 1 } : r
      )
    );
  };

  const StarRating = ({ rating, max = 5 }) => (
    <div style={{ color: "#FFD700" }}>
      {[...Array(max)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  const Card = ({ review }) => (
    <article className="rv-card">
      {/* 이미지 */}
      <div className="rv-thumb-wrap">
        <img
          src={`/img/reviews/${review.reviewImage}`}
          alt={review.reviewId}
          className="rv-thumb"
        />
      </div>
      {/* 내용 */}
      <div className="rv-body">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <StarRating rating={review.score} />
          <span>{review.score}점</span>
        </div>
        <div className="rv-meta">
          <span className="rv-meta-dim">{review.writer} | {formatDate(review.reviewDate)}</span>
        </div>
        <p className="rv-text">{review.reviewContent}</p>
        <div className="rv-foot">
          <button onClick={() => onLike(review.reviewId)} style={{ cursor: "pointer" }}>
            👍 {review.luv}
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <main className="rv-page">
      <section className="photo-review-section">
        <div className="photo-review-container">
          <img
            src={require("../../resources/images/main_banner.png")} // 이미지 URL을 여기에 넣으세요
            alt="Photo Reviews"
            className="photo-review-image"
          />
          <div className="photo-review-text">
            <h2>고객님들의 리얼한 후기</h2>
            <p>PHOTO REVIEWS</p>
          </div>
        </div>
      </section>
      {/* 툴바 */}
      <div className="rv-toolbar">
        <div />
        <label className="rv-select-wrap">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1); // 페이지를 1로 초기화
            }}
            className="rv-select"
          >
            <option value="latest">최신순</option>
            <option value="rating">별점 높은순</option>
            <option value="likes">좋아요 많은순</option>
          </select>
        </label>
      </div>

      {/* 리뷰 카드 */}
      <section className="rv-grid">
        {sorted.map((r) => (
          <Card key={r.reviewId} review={r} />
        ))}
      </section>

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => setPage(p)}
      />
    </main>
  );
}

function Pagination({ page, totalPages, onChange }) {
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
