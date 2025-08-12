import React, { useState } from 'react';

const ShopReview = () => {
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const [reviews, setReviews] = useState([
        {
            reviewId: 1,
            score: 4,
            writer: "user123",
            reviewContent: "정말 좋았습니다! 다시 방문할게요. 가격도 적당하고 품질이 좋아서 만족합니다.",
            reviewDate: "2025-08-12",
            reviewImage: null,
            likes: 5
        },
        {
            reviewId: 2,
            score: 5,
            writer: "flowerlover",
            reviewContent: "꽃이 너무 예쁘고 포장도 깔끔했어요. 사장님이 친절해서 기분 좋게 구매했습니다.",
            reviewDate: "2025-08-10",
            reviewImage: "https://via.placeholder.com/150",
            likes: 10
        }
    ]);

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

    // 아이디 마스킹
    const maskId = (id) => {
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
                    ? { ...review, likes: review.likes + 1 }
                    : review
            )
        );
    };

    // 리뷰 카드
    const ReviewCard = ({ review }) => {
        const isExpanded = expandedReviewId === review.reviewId;
        const shortText = review.reviewContent.length > 100 && !isExpanded
            ? review.reviewContent.slice(0, 100) + '...'
            : review.reviewContent;

        return (
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StarRating rating={review.score} />
                    <span style={{ marginLeft: '8px' }}>{review.score}점</span>
                </div>

                <div style={{ marginTop: '5px', color: '#555' }}>
                    {maskId(review.writer)} | {review.reviewDate}
                </div>

                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
                            onClick={() => onExpandToggle(review.reviewId)}
                        >
                            {shortText}
                            {review.reviewContent.length > 100 && (
                                <p style={{ color: 'gray' }}>
                                    {isExpanded ? '간략히 보기' : '...자세히 보기'}
                                </p>
                            )}
                        </div>
                    </div>

                    {review.reviewImage && (
                        <img
                            src={review.reviewImage}
                            alt="리뷰 이미지"
                            style={{ width: 150, height: 150, objectFit: 'cover', marginLeft: '10px' }}
                        />
                    )}
                </div>

                <button
                    onClick={() => onLike(review.reviewId)}
                    style={{
                        position: 'absolute',
                        right: '15px',
                        bottom: '15px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    👍 {review.likes}
                </button>
            </div>
        );
    };

    return (
        <div>
            {reviews.map(review => (
                <ReviewCard key={review.reviewId} review={review} />
            ))}
        </div>
    );
};

export default ShopReview;
