import React from 'react';

const ShopReview = () => {
    const StarRating = ({ rating, max = 5 }) => {
        return (
            <div style={{ color: '#FFD700' }}>
                {[...Array(max)].map((_, i) => (
                    <span key={i}>{i < rating ? '★' : '☆'}</span>
                ))}
            </div>
        );
    };

    const maskId = (id) => {
        if (id.length <= 3) return id + '***';
        return id.slice(0, 3) + '*'.repeat(id.length - 3);
    };

    const ReviewCard = ({review}) => {
        const shortText = review.reviewContent.length > 100 ? review.reviewContent.slice(0, 100) : review.reviewContent;
        // shortText += '...자세히 보기'

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
                            {shortText}<p style={{color:'gray'}}>...자세히 보기</p>
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

                <button onClick={() => onLike(review.reviewId)}
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
        <>
            <div>
                <ReviewCard review={data.reviewList} />
            </div>
        </>
    )
}

export default ShopReview;