import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// CSS Styles
const myReviewsStyles = `
  .myreviews-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
  }
  .myreviews-title {
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
  }
  .tab-button {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    color: #888;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease, border-bottom 0.3s ease;
  }
  .tab-button.active {
    color: #f77893;
    border-bottom: 2px solid #f77893;
  }
  .review-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .review-item {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .review-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .review-item-details {
    display: flex;
    flex-direction: column;
  }
  .product-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
  .order-date, .review-date {
    font-size: 0.85rem;
    color: #777;
    margin: 5px 0 0;
  }
  .price {
    font-size: 1rem;
    font-weight: bold;
    color: #555;
    margin: 5px 0 0;
  }
  .write-review-button {
    background-color: #f77893;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }
  .write-review-button:hover {
    background-color: #e56580;
  }
  .rating {
    color: #ffc107;
    font-size: 1.2rem;
    margin-top: 5px;
  }
  .review-item-body {
    margin-top: 10px;
  }
  .review-content {
    font-size: 0.95rem;
    color: #444;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .review-image-container {
    margin-top: 10px;
    text-align: center;
  }
  .review-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .no-reviews {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 1rem;
  }
`;

function MyReviewList() {
  const navigate = useNavigate();
  const [todoReviews, setTodoReviews] = useState([]); // 작성할 리뷰
  const [doneReviews, setDoneReviews] = useState([]); // 작성 완료 리뷰
  const [activeTab, setActiveTab] = useState("todo"); // 'todo' 또는 'done'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem("loginId"); // 세션에서 사용자 ID 가져오기

  useEffect(() => {
    // Inject styles dynamically
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = myReviewsStyles;
    document.head.appendChild(styleSheet);
  }, []);

  useEffect(() => {
    if (!userId) {
      setError("로그인 정보가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/mypage/reviews/${userId}`);
        const { todoList, doneList } = response.data;
        setTodoReviews(todoList);
        setDoneReviews(doneList);
      } catch (err) {
        console.error("리뷰 정보를 불러오는 데 실패했습니다.", err);
        setError("리뷰 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return <div className="myreviews-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="myreviews-container error-message">{error}</div>;
  }

  return (
    <div className="myreviews-container">
      <h2 className="myreviews-title">리뷰 관리</h2>

      {/* 탭 네비게이션 */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "todo" ? "active" : ""}`}
          onClick={() => setActiveTab("todo")}
        >
          작성할 후기 ({todoReviews.length})
        </button>
        <button
          className={`tab-button ${activeTab === "done" ? "active" : ""}`}
          onClick={() => setActiveTab("done")}
        >
          작성 완료 후기 ({doneReviews.length})
        </button>
      </div>

      {/* 리뷰 목록 */}
      <div className="review-list">
        {activeTab === "todo" ? (
          // 작성할 후기 목록
          todoReviews.length > 0 ? (
            todoReviews.map((item) => (
              <div className="review-item" key={item.bouquetCode}>
                <div className="review-item-header">
                  <div className="review-item-details">
                    <p className="product-name">{item.productName}</p>
                    <p className="order-date">주문일: {new Date(item.orderDate).toLocaleDateString()}</p>
                    <p className="price">{item.price.toLocaleString()}원</p>
                  </div>
                  <button
                    className="write-review-button"
                    onClick={() => navigate(`/mypage/reviews/write/${item.bouquetCode}`)}
                  >
                    리뷰 쓰기
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">작성할 후기가 없습니다.</div>
          )
        ) : (
          // 작성 완료 후기 목록
          doneReviews.length > 0 ? (
            doneReviews.map((item) => (
              <div className="review-item" key={item.reviewId}>
                <div className="review-item-header">
                  <div className="review-item-details">
                    <p className="product-name">{item.productName}</p>
                    <p className="review-date">작성일: {new Date(item.reviewDate).toLocaleDateString()}</p>
                    <div className="rating">
                      {"★".repeat(item.score)}
                      {"☆".repeat(5 - item.score)}
                    </div>
                  </div>
                </div>
                <div className="review-item-body">
                  <p className="review-content">{item.reviewContent}</p>
                </div>
                {item.reviewImage && (
                  <div className="review-image-container">
                    <img src={`/img/reviews/${item.reviewImage}`} alt="리뷰 이미지" className="review-image" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-reviews">작성한 후기가 없습니다.</div>
          )
        )}
      </div>
    </div>
  );
}

export default MyReviewList;
