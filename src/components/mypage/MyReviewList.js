// src/pages/MyReviewList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MyReviewList() {
  const [tab, setTab] = useState("todo"); // "todo" | "done"
  const [purchases, setPurchases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const userid = "test1"; // ⭐ 로그인 사용자 ID

  useEffect(() => {
    // 작성한 후기
    axios.get(`http://localhost/api/mypage/reviews/${userid}`)
      .then(res => setReviews(res.data.rlist || []))
      .catch(err => console.error("리뷰 불러오기 실패:", err));

    // 작성할 후기 (주문 내역 API 필요)
    axios.get(`http://localhost/api/mypage/orders/${userid}`)
      .then(res => setPurchases(res.data || []))
      .catch(err => console.error("주문내역 불러오기 실패:", err));
  }, [userid]);

  const todoList = useMemo(() => {
    const reviewedIds = new Set(reviews.map(r => r.productId));
    return purchases.filter(p => !reviewedIds.has(p.productId));
  }, [purchases, reviews]);

  const doneList = reviews;
  const list = tab === "todo" ? todoList : doneList;

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        {/* 탭 버튼 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setTab("todo")}
            style={{ ...styles.tabBtn, ...(tab === "todo" ? styles.tabBtnActive : {}) }}
          >
            작성할 후기 ({todoList.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("done")}
            style={{ ...styles.tabBtn, ...(tab === "done" ? styles.tabBtnActive : {}) }}
          >
            작성한 후기 ({doneList.length})
          </button>
        </div>

        {/* 리스트 */}
        {list.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          list.map((item) =>
            tab === "todo" ? (
              <ToWriteCard key={item.orderId} item={item} />
            ) : (
              <WrittenCard key={item.reviewId} item={item} />
            )
          )
        )}
      </section>
    </main>
  );
}

/* ====== 카드: 작성할 후기 ====== */
function ToWriteCard({ item }) {
  return (
    <div style={styles.reviewCard}>
      <div style={styles.reviewHeader}>
        <div style={styles.reviewTitle}>{item.productName}</div>
        <div style={styles.reviewDate}>{new Date(item.orderDate).toLocaleDateString("ko-KR")}</div>
      </div>
      <div style={styles.reviewWriter}>옵션 {item.option} · {item.price}원</div>
      <Link
        to={`/mypage/reviews/write/${item.productId}`}
        state={item}
        style={styles.primaryBtn}
      >
        리뷰 쓰기
      </Link>
    </div>
  );
}

/* ====== 카드: 작성한 후기 ====== */
function WrittenCard({ item }) {
  const productNameMap = {
    1: "커스텀 꽃다발 (소)",
    2: "커스텀 꽃다발 (중)",
    3: "커스텀 꽃다발 (대)"
  };

  return (
    <div style={styles.reviewCard}>
      <div style={styles.reviewGrid}>
        {/* 왼쪽 텍스트 영역 */}
        <div style={{ flex: 1 }}>
          <div style={styles.reviewHeader}>
            <div style={styles.reviewTitle}>
              {productNameMap[item.productId] || `상품 ID ${item.productId}`}
            </div>
            <div style={styles.reviewDate}>
              {new Date(item.reviewDate).toLocaleDateString("ko-KR")}
            </div>
          </div>
          <div style={styles.reviewWriter}> {item.writer}</div>
          <div style={{ marginBottom: 8 }}>
            <Stars value={item.score} />
          </div>
          <div style={styles.reviewContent}>{item.reviewContent}</div>
        </div>

        {/* 오른쪽 이미지 영역 */}
        <div style={styles.reviewImageBox}>
          {item.reviewImage ? (
            <img
              src={item.reviewImage}
              alt="리뷰 이미지"
              style={styles.reviewImage}
            />
          ) : (
            <div style={styles.noImage}>이미지 없음</div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ====== 보조 컴포넌트 ====== */
function Stars({ value = 0, max = 5 }) {
  return (
    <span aria-label={`별점 ${value}/${max}`} style={{ color: "gold", fontSize: 16 }}>
      {"★".repeat(value)}
      <span style={{ color: "#ddd" }}>
        {"★".repeat(Math.max(0, max - value))}
      </span>
    </span>
  );
}

function EmptyState({ tab }) {
  const text = tab === "todo" ? "작성할 후기가 없습니다." : "작성한 후기가 없습니다.";
  return (
    <div style={{ textAlign: "center", color: "#777", padding: "40px 0" }}>
      <div>{text}</div>
    </div>
  );
}

/* ====== 스타일 ====== */
const styles = {
  page: {
    display: "grid",
    placeItems: "center",
    padding: "32px 16px",
    background: "#fafafa",
    minHeight: "100vh",
  },
  panel: {
    width: "min(720px, 92vw)",
    background: "#fff",
    border: "1.5px solid #ffd6e0",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 2px 6px rgba(255, 127, 147, 0.15)",
  },
  tabBtn: {
    height: 40,
    borderRadius: 999,
    border: "1px solid #ffd6e0",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s ease",
  },
  tabBtnActive: {
    background: "#ff7f93",
    color: "#fff",
    borderColor: "#ff7f93",
    fontWeight: 600,
  },
  primaryBtn: {
    textDecoration: "none",
    background: "#ff7f93",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
  },
  reviewCard: {
    border: "1px solid #ffe0e6",
    borderRadius: 12,
    padding: "20px 22px", // 👉 카드 내부 여백 넉넉히
    margin: "14px 0",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(255, 127, 147, 0.1)",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  reviewWriter: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  reviewContent: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
    lineHeight: 1.6, // 👉 줄 간격 넉넉히
    whiteSpace: "pre-line",
  },
};
