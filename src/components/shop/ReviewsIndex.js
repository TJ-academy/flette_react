import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/ReviewsIndex.css"; // 스타일 시트 파일

const PAGE_SIZE = 8;

// ✅ 커스텀 드롭다운 컴포넌트
function CustomDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="rv-dropdown">
      <button
        type="button"
        className="rv-dropdown-btn"
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : "선택"}
        <span className="rv-caret">▼</span>
      </button>

      {open && (
        <ul className="rv-dropdown-list">
          {options.map(opt => (
            <li
              key={opt.value}
              className={`rv-dropdown-item ${opt.value === value ? "is-active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReviewsIndex() {
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [dim, setDim] = useState(false);

  // 리뷰 데이터 가져오기
  useEffect(() => {
    axios
      .get(`https://sure-dyane-flette-f3f77cc0.koyeb.app/api/all/reviews?page=${page}&size=${PAGE_SIZE}`)
      .then((response) => {
        setData(response.data);
        //console.log(response.data);
        //setReviews(response.data.fdate.content);
        //setReviews(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [page]);

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 정렬
  const sorted = useMemo(() => {
    if (!data || !Array.isArray(data.content)) return [];
    const arr = [...data.content];
    //const arr = [...reviews];
    if (sort === "rating") {
      return arr.sort((a, b) => b.score - a.score);
      // arr.sort((a, b) => b.score - a.score);
    }
    else if (sort === "likes") {
      return arr.sort((a, b) => (b.luv || 0) - (a.luv || 0)); // luv가 없을 경우 0으로 처리
      // arr.sort((a, b) => b.luv - a.luv);
    }
    else {
      return arr.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
      //arr.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
    }
    // return arr;
    
  }, [data, sort]);

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
      .post(`https://sure-dyane-flette-f3f77cc0.koyeb.app/api/reviews/${id}/like`)
      .catch((err) => {
        console.error("좋아요 실패", err);
        alert("좋아요 처리 중 오류가 발생했습니다.");
      });
  };

  const StarRating = ({ rating, max = 5 }) => (
    <div className="star-rating">
      {[...Array(max)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  // 모달 열기
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
      <div className="rv-thumb-wrap">
        <img
          src={`${review.reviewImage}`}
          alt={review.reviewId}
          className="rv-thumb"
        />
      </div>
      <div className="rv-body">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <StarRating rating={review.score} />
          <span>{review.score}점</span>
        </div>
        <div className="rv-meta">
          <span className="rv-meta-dim">
            {review.writer} | {formatDate(review.reviewDate)}
          </span>
        </div>
        <p className="rv-text">{review.reviewContent}</p>
        <div className="rv-foot">
          <button
            className="rv-like-btn"
            onClick={(e) => {
              e.stopPropagation();
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
      <section className={`hero ${dim ? "is-dim" : ""}`}>
        <img
          src={require("../../resources/images/main_banner.png")}
          alt="포토 리뷰 배너"
          className="hero-bg"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">고객님의 포토 리뷰</h1>
          <p className="hero-desc">
            다양한 포토 리뷰를 통해<br />
            꽃다발을 선택해보세요!
          </p>
          <Link
            to="/shop"
            className="primary-btn"
            onMouseEnter={() => setDim(true)}
            onMouseLeave={() => setDim(false)}
          >
            &nbsp;&nbsp;&nbsp;&nbsp; 내 꽃다발 만들기 &nbsp;&nbsp;&nbsp;&nbsp;
          </Link>
        </div>
      </section>

      {/* 툴바 */}
      <div className="rv-toolbar">
        <div />
        <CustomDropdown
          options={[
            { value: "latest", label: "최신순" },
            { value: "rating", label: "별점 높은순" },
            { value: "likes", label: "좋아요 많은순" },
          ]}
          value={sort}
          onChange={(val) => {
            setSort(val);
            setPage(1);
          }}
        />
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
            <div className="modal-header">
              <h2>리뷰 상세</h2>
              <button onClick={closeModal} className="close-btn">
                X
              </button>
            </div>
            <div className="modal-body vertical">
              {selectedReview.reviewImage && (
                <img
                  src={`${selectedReview.reviewImage}`}
                  alt={selectedReview.reviewId}
                  className="modal-image-large"
                />
              )}
              <div className="modal-text">
                <StarRating rating={selectedReview.score} />
                <span
                  style={{ display: "block", textAlign: "center", marginTop: "4px" }}
                >
                  {selectedReview.score}점
                </span>
                <br />
                <p className="modal-paragraph">
                  {selectedReview.reviewContent || "내용이 없습니다."}
                </p>
                <div className="modal-meta" style={{ textAlign: "center" }}>
                  <br />
                  <span>{selectedReview.writer}</span> |{" "}
                  <span>{formatDate(selectedReview.reviewDate)}</span>
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
