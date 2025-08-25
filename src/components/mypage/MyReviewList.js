import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/mypage/mypagereview.css";

function MyReviewList() {
  const navigate = useNavigate();
  const [todoReviews, setTodoReviews] = useState([]);
  const [doneReviews, setDoneReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("done");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // 한 페이지당 보여줄 리뷰 수
  const userId = sessionStorage.getItem("loginId");

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

  if (loading) return <div className="myreviews-container">로딩 중...</div>;
  if (error) return <div className="myreviews-container error-message">{error}</div>;

  // 현재 탭 데이터
  const currentReviews = activeTab === "todo" ? todoReviews : doneReviews;
  const totalPages = Math.ceil(currentReviews.length / reviewsPerPage);
  const paginatedReviews = currentReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

const renderCard = (item, type) => (
  <div
    className="review-card"
    key={type === "todo" ? item.bouquetCode : item.reviewId}
    onClick={() => navigate(`/shop/${item.productId}/detail#reviews`)}
  >
    {/* 텍스트/버튼 부분 */}
    <div className="review-info">
      <p className="product-name">{item.productName}</p>
      {type === "done" ? (
        <>
          <div className="rating">
            {"★".repeat(item.score)}
            {"☆".repeat(5 - item.score)}
          </div>
          <p className="review-content">{item.reviewContent}</p>
        </>
      ) : (
        <>
          <p className="review-content">아직 리뷰를 작성하지 않았습니다.</p>
          <button
            className="write-review-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mypage/reviews/write/${item.bouquetCode}`);
            }}
          >
            리뷰 쓰기
          </button>
        </>
      )}
    </div>

    {/* 이미지: 오른쪽에만 표시 */}
    {type === "todo" ? (
      <img
        src={`/img/product/${item.imageName || "default.png"}`}
        alt="상품 이미지"
        className="review-image"
      />
    ) : (
      item.reviewImage && (
        <img
          src={`/img/reviews/${item.reviewImage}`}
          alt="리뷰 이미지"
          className="review-image"
        />
      )
    )}

    <div className="review-arrow">
      <img src="/img/arrow_left.png" alt="arrow" className="arrow-icon" />
    </div>
  </div>
);


  return (
    <div className="myreviews-container">
      <h2 className="myreviews-title">리뷰 관리</h2>

      {/* 탭 */}
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "todo" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("todo");
            setCurrentPage(1);
          }}
        >
          리뷰 쓰기 ({todoReviews.length})
        </button>
        <button
          className={`tab-button ${activeTab === "done" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("done");
            setCurrentPage(1);
          }}
        >
          작성한 리뷰 ({doneReviews.length})
        </button>
      </div>

      {/* 리뷰 박스 */}
      <div className="review-box">
        {paginatedReviews.length > 0 ? (
          paginatedReviews.map((item) =>
            activeTab === "todo"
              ? renderCard(item, "todo")
              : renderCard(item, "done")
          )
        ) : (
          <div className="no-reviews">
            {activeTab === "todo"
              ? "작성할 후기가 없습니다."
              : "작성한 후기가 없습니다."}
          </div>
        )}
      </div>

      {/* 페이지네이션: 페이지 수가 1 이상일 때만 표시 */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <span
              key={idx + 1}
              className={`page ${currentPage === idx + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviewList;