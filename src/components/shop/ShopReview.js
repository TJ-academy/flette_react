import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {useNavigate, useParams} from 'react-router-dom';

function useFetch(url) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(url)
        .then((response) => {
            setData(response.data);
        });
    }, [url]);
    return data;
}

function ShopReview() {
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const {productId} = useParams();
    const data = useFetch(`http://localhost/api/shop/${productId}/review`);
    const [reviews, setReviews] = useState([]);
    setReviews = data?.rlist || [{
        reviewId: 1,
        score: 4,
        writer: "user123",
        reviewContent: "정말 좋았습니다! 다시 방문할게요. "
                    +"\n가격도 적당하고 품질이 좋아서 만족합니다. 뭐라고 글씨를 더 써야하는데 뭐라고 쓸까요. 꽃다발 참 예뻤다고 하네요. 여기서 더 적어야 한다니 100자라는 것은 생각보다 많은 양이군요. 아 언제까지 써야하지. 의느이ㅏㅡ니아ㅡ린",
        reviewDate: "2025-08-12",
        reviewImage: null,
        luv: 5
    },
    {
        reviewId: 2,
        score: 5,
        writer: "flowerlover",
        reviewContent: "꽃이 너무 예쁘고 포장도 깔끔했어요. 사장님이 친절해서 기분 좋게 구매했습니다.",
        reviewDate: "2025-08-10",
        reviewImage: "https://via.placeholder.com/150",
        luv: 10
    }]; 

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

    // 리뷰 카드
    const ReviewCard = ({ review }) => {
        const isExpanded = expandedReviewId === review.reviewId;
        const shortText = review.reviewContent.length > 100 && !isExpanded
            ? review.reviewContent.slice(0, 100) + "..."
            : review.reviewContent;
        const formattedDate = new Date(review.reviewDate).toISOString().split('T')[0];

        return (
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StarRating rating={review.score} />
                    <span style={{ marginLeft: '8px' }}>{review.score}점</span>
                </div>

                <div style={{ marginTop: '5px', color: '#555' }}>
                    {maskId(review.writer)} | {formattedDate}
                </div>

                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{ whiteSpace: 'pre-wrap', cursor: 'pointer', width: '800px' }}
                            onClick={() => onExpandToggle(review.reviewId)}
                        >
                            {shortText} {review.reviewContent.length > 100 && (
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
                            style={{ width: 150, height: 150, objectFit: 'cover', right: '10px' }}
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
                    👍 {review.luv}
                </button>
            </div>
        );
    };

    if(!reviews || reviews.length === 0) {
        return <p><strong>등록된 리뷰가 없습니다.</strong></p>
    }

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <StarRating rating={getFinalScore()} />
                <h2>
                    고객 총 평점: <span style={{ color: '#FFD700' }}>{getFinalScore()}점</span> / 5
                </h2>
                
                <p>전체 리뷰 수: {reviews.length}개</p>
            </div>

            <div>
                {reviews.map((review) => (
                    <ReviewCard key={review.reviewId} review={review} />
                ))}
            </div>
        </div>
    );
};

export default ShopReview;