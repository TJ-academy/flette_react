import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/shop/shopreview.css";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((er) => setError(er));
  }, [url]);

  return [data, loading, error];
}

function ShopReview() {
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const { productId } = useParams();
  const [data, loading, error] = useFetch(
    `http://localhost/api/shop/${productId}/review`
  );
  const [reviews, setReviews] = useState([]);
  const loginId = sessionStorage.getItem("loginId");

  useEffect(() => {
    if (data && Array.isArray(data.rlist)) {
      setReviews(data.rlist);
    }
  }, [data]);

  // 별점
  const StarRating = ({ rating = 0, max = 5 }) => (
    <div className="stars">
      {[...Array(max)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  // 고객 총 평점
  const getFinalScore = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.score || 0), 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  // 아이디 마스킹
  const maskId = (id = "") =>
    id.length <= 3 ? id + "***" : id.slice(0, 3) + "*".repeat(id.length - 3);

  // 펼치기/접기
  const onExpandToggle = (id) =>
    setExpandedReviewId((prev) => (prev === id ? null : id));

  // 좋아요
  const onLike = (id) => {
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

  // 날짜 포맷
  const formattedDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

 // 리뷰 카드
const ReviewCard = ({ review }) => {
    const isExpanded = expandedReviewId === review.reviewId;
    const text =
      review.reviewContent && review.reviewContent.length > 80 && !isExpanded
        ? review.reviewContent.slice(0, 100) + "..."
        : review.reviewContent;
  
    return (
      <div className="review-card">
        {/* 왼쪽 */}
        <div className="review-left">
          {/* 별점 + 점수 */}
          <div className="review-score">
            <StarRating rating={review.score} />
            <span>{review.score}</span>
          </div>
  
          {/* 작성자 + 날짜 */}
          <div className="review-meta">
            <span>{maskId(review.writer)}</span>
            <span> | </span>
            <span>{formattedDate(review.reviewDate)}</span>
          </div>
  
          {/* 리뷰 내용 */}
          <div
            className="review-text"
            onClick={() => onExpandToggle(review.reviewId)}
          >
            {text}
            {review.reviewContent &&
              review.reviewContent.length > 80 && (
                <p className="review-more">
                  {isExpanded ? "간략히 보기" : "...자세히 보기"}
                </p>
              )}
          </div>
        </div>
  
        {/* 오른쪽 */}
        <div className="review-right">
          {review.reviewImage && (
            <img
              src={`/img/reviews/${review.reviewImage}`}
              alt="리뷰 이미지"
              className="review-thumb"
            />
          )}
          <button className="btn-like" onClick={() => onLike(review.reviewId)}>
            👍 {review.luv}
          </button>
        </div>
      </div>
    );
  };
  

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>리뷰를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <>
      {!reviews || reviews.length === 0 ? (
        <p className="review-empty">
          <strong>등록된 리뷰가 없습니다.</strong>
        </p>
      ) : (
        <div className="review-wrap">
          {/* 상단 요약 */}
          <div className="review-summary">
            <div className="summary-col">
              <p className="summary-title">고객 총 평점</p>
              <StarRating rating={getFinalScore()} />
              <p className="summary-score">{getFinalScore()} / 5</p>
            </div>

            <div className="summary-divider" />

            <div className="summary-col">
              <p className="summary-title">전체 리뷰 수</p>
              <div className="stars">💬</div>
              <p className="summary-score">{reviews.length}개</p>
            </div>
          </div>

          <div className="review-divider" />

          {/* 리스트 */}
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.reviewId} review={review} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ShopReview;
