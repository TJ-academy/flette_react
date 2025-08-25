import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/ReviewsIndex.css"; // 스타일 시트 파일

const PAGE_SIZE = 8;

export default function ReviewsIndex() {
  const [sort, setSort] = useState("latest"); // 최신순, 별점순, 좋아요순 등으로 정렬
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰
   const [dim, setDim] = useState(false);

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

  // 좋아요
  const onLike = (id) => {
    const loginId = sessionStorage.getItem("loginId");
    if (!loginId) {
      alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }

    setReviews((prev) =>
      prev.map((r) => (r.reviewId === id ? { ...r, luv: (r.luv || 0) + 1 } : r))
    );

    axios
      .post(`/api/reviews/${id}/like`)
      .catch((err) => {
        console.error("좋아요 실패", err);
        alert("좋아요 처리 중 오류가 발생했습니다.");
    });
  };

  const StarRating = ({ rating, max = 5 }) => (
    <div style={{ color: "#FFD700" }}>
      {[...Array(max)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  // Card 클릭 시 모달 열기
  const openModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

const Card = ({ review }) => (
  <article className="rv-card" onClick={() => openModal(review)}>
    {/* 이미지 */}
    <div className="rv-thumb-wrap">
      <img
        src={`http://localhost:80/img/reviews/${review.reviewImage}`}
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
        <button 
          className="rv-like-btn" 
          onClick={(e) => {
            e.stopPropagation();        // 모달 열리지 않게!
            onLike(review.reviewId);
          }}
        >
          <span className="rv-like-icon">👍</span>
          {review.luv}
        </button>
      </div>
    </div>
  </article>
);


  return (
    <main className="rv-page">
    <section className={`hero ${dim ? 'is-dim' : ''}`}>
  <img 
    src={require("../../resources/images/main_banner.png")} 
    alt="포토 리뷰 배너" 
    className="hero-bg" 
  />
  <div className="hero-overlay">
    <h1 className="hero-title">고객님의 포토 리뷰</h1>
    <p className="hero-desc">
      다양한 포토 리뷰를 통해<br/>
      꽃다발을 선택해보세요!
    </p>
    <Link
      to="/shop"
      className="primary-btn"
      onMouseEnter={() => setDim(true)}   // 마우스 올리면 배경 어두워짐
      onMouseLeave={() => setDim(false)}  // 마우스를 떼면 배경 원래대로
    >
      &nbsp;&nbsp;&nbsp;&nbsp;
      내 꽃다발 만들기
      &nbsp;&nbsp;&nbsp;&nbsp;
    </Link>
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

      {/* 모달 */}
{isModalOpen && selectedReview && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {/* 헤더 수정 */}
      <div className="modal-header">
        <h2>리뷰 상세</h2>
        <button onClick={closeModal} className="close-btn">X</button>
      </div>

      {/* 이미지와 내용 부분 나누기 */}
      <div className="modal-body">
        {/* 이미지 영역 */}
        <div className="modal-image-wrap">
          <img
            src={`/img/reviews/${selectedReview.reviewImage}`}
            alt={selectedReview.reviewId}
            className="modal-image"
          />
        </div>

        {/* 내용 영역 */}
        <div className="modal-text">
          <StarRating rating={selectedReview.score} />
          <p>{selectedReview.reviewContent}</p>
          <div>
            <span>{selectedReview.writer}</span> | <span>{formatDate(selectedReview.reviewDate)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

      )}
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
