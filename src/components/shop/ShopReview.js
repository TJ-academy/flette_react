import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(url)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((er) => {
                setError(er);
            });
    }, [url]);

    return [data, loading, error];
}

function ShopReview() {
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const { productId } = useParams();
    const [data, loading, error] = useFetch(`http://localhost/api/shop/${productId}/review`);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (data) {
            setReviews(data.rlist);
        }
    }, [data]);

    // 별점 컴포넌트
    const StarRating = ({ rating, max = 5 }) => {
        return (
            <div style={{ color: '#FFD700' }}>
                {[...Array(max)].map((_, i) => (
                    <span key={i}>{i < rating ? '★' : '☆'}</span>
                ))}
            </div>
        );
    };

    // 고객 총 평점
    const getFinalScore = () => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, r) => sum + r.score, 0);
        return (total / reviews.length).toFixed(1);
    };

    // 아이디 마스킹
    const maskId = (id) => {
        if (!id) return "";
        if (id.length <= 3) return id + '***';
        return id.slice(0, 3) + '*'.repeat(id.length - 3);
    };

    // 리뷰 펼치기/접기
    const onExpandToggle = (id) => {
        setExpandedReviewId(prevId => (prevId === id ? null : id));
    };

    // 좋아요 증가
    const onLike = (id) => {
        setReviews(prev =>
            prev.map(review =>
                review.reviewId === id
                    ? { ...review, luv: review.luv + 1 }
                    : review
            )
        );
    };

    // ✅ 날짜 포맷 함수 (null-safe)
    const formattedDate = (isoString) => {
        if (!isoString) return "";
        const d = new Date(isoString);
        return isNaN(d) ? "" : d.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    };

    // 리뷰 카드
    const ReviewCard = ({ review }) => {
        const isExpanded = expandedReviewId === review.reviewId;
        const shortText = review.reviewContent && review.reviewContent.length > 80 && !isExpanded
            ? review.reviewContent.slice(0, 100) + "..."
            : review.reviewContent;

        return (
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', position: 'relative', minHeight: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StarRating rating={review.score} />
                    <span style={{ marginLeft: '8px' }}>{review.score}점</span>
                </div>

                <div style={{ marginTop: '5px', color: '#555' }}>
                    {maskId(review.writer)} | {formattedDate(review.reviewDate)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '40px', position: 'relative' }}>
                    <div
                        style={{ width: '800px', cursor: 'pointer', whiteSpace: 'pre-wrap', alignSelf: 'flex-start' }}
                        onClick={() => onExpandToggle(review.reviewId)}
                    >
                        {shortText} {review.reviewContent && review.reviewContent.length > 80 && (
                            <p style={{ color: 'gray' }}>
                                {isExpanded ? '간략히 보기' : '...자세히 보기'}
                            </p>
                        )}
                    </div>

                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}>
                        {review.reviewImage && (
                            <img
                                src={review.reviewImage}
                                alt="리뷰 이미지"
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                        )}

                        <button
                            onClick={() => onLike(review.reviewId)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            👍 {review.luv}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>리뷰를 불러오는 중 오류가 발생했습니다.</p>;

    return (
        <>
            {(!reviews || reviews.length === 0) ? (
                <p><strong>등록된 리뷰가 없습니다.</strong></p>
            ) : (
                <div>
                    <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '30px', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                            <p style={{ margin: 0 }}>고객 총 평점</p>
                            <StarRating rating={getFinalScore()} />
                            <p style={{ margin: 0 }}>{getFinalScore()} / 5</p>
                        </div>
                        <div>
                            |<br />|<br />|
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p style={{ margin: 0 }}>전체 리뷰 수</p>
                            <span>💬</span>
                            <p style={{ margin: 0 }}>{reviews.length}개</p>
                        </div>
                    </div>

                    <div>
                        {reviews.map((review) => (
                            <ReviewCard key={review.reviewId} review={review} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopReview;
