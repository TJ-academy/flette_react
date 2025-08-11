// src/pages/MyReviewList.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const LS_KEY = "flette-reviews";

/** 처음 방문 시 채워 넣을 기본 데이터 */
const defaultState = {
  purchases: [
    // reviewed === false → 작성할 후기
    { id: 9001, productName: "라이트 튤립 (소)", option: "크림/핑크", price: "19,800원", date: "2025.08.05", thumb: "https://picsum.photos/seed/ft1/80/80", reviewed: false },
    { id: 9002, productName: "가든 부케 (소)", option: "레드/화이트", price: "19,800원", date: "2025.08.01", thumb: "https://picsum.photos/seed/ft2/80/80", reviewed: false },
    { id: 9003, productName: "가든 부케 (소)", option: "레드/화이트", price: "19,800원", date: "2025.08.01", thumb: "https://picsum.photos/seed/ft2/80/80", reviewed: false },
    // reviewed === true → 이미 작성한 항목
    { id: 9101, productName: "커스텀 꽃다발 (중)", option: "옐로/피치", price: "29,800원", date: "2025.07.30", thumb: "https://picsum.photos/seed/ft3/80/80", reviewed: true },
  ],
  reviews: [
    { id: 101, purchaseId: 9101, productName: "커스텀 꽃다발 (중)", option: "옐로/피치", price: "29,800원", date: "2025.07.31", rating: 5, text: "색감이 정말 예뻐요. 선물 받는 분이 엄청 좋아했습니다!", thumb: "https://picsum.photos/seed/ft3/80/80" },
  ],
};

export default function MyReviewList() {
  const [tab, setTab] = useState("todo"); // "todo" | "done"
  const [purchases, setPurchases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const location = useLocation();

  // localStorage → 상태 로드
  const loadFromLS = useCallback(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) return;
    const s = JSON.parse(saved);
    setPurchases(s.purchases || []);
    setReviews(s.reviews || []);
  }, []);

  // 샘플 데이터로 초기화(버튼용)
  const seedDemo = useCallback(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(defaultState));
    setPurchases(defaultState.purchases);
    setReviews(defaultState.reviews);
    setTab("todo");
  }, []);

  // 최초 로드(없으면 기본 데이터로 초기화)
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      loadFromLS();
    } else {
      seedDemo();
    }
  }, [loadFromLS, seedDemo]);

  // 작성 페이지에서 돌아오면: 탭 세팅 + 데이터 재로딩
  useEffect(() => {
    if (location.state?.tab) setTab(location.state.tab);
    if (location.state?.refresh) loadFromLS();
  }, [location.state, loadFromLS]);

  // 탭별 리스트
  const todoList = useMemo(() => purchases.filter((p) => !p.reviewed), [purchases]);
  const doneList = reviews;
  const list = tab === "todo" ? todoList : doneList;

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        {/* 탭 + 우측에 샘플 채우기 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
          <div style={styles.tabs}>
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
          <button onClick={seedDemo} style={styles.seedBtn} title="샘플 데이터 다시 넣기">
            샘플 채우기
          </button>
        </div>

        {/* 리스트 */}
        <div style={{ marginTop: 12 }}>
          {list.length === 0 ? (
            <EmptyState tab={tab} onSeed={seedDemo} />
          ) : (
            list.map((item) =>
              tab === "todo" ? (
                <ToWriteCard key={item.id} item={item} />
              ) : (
                <WrittenCard key={item.id} item={item} />
              )
            )
          )}
        </div>
      </section>
    </main>
  );
}

/* ====== 카드: 작성할 후기 ====== */
function ToWriteCard({ item }) {
  return (
    <div style={styles.card}>
      <img src={item.thumb} alt="" style={styles.thumb} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.titleRow}>
          <div style={styles.title}>{item.productName}</div>
          <div style={styles.meta}>{item.date}</div>
        </div>
        <div style={styles.meta}>옵션 {item.option} · {item.price}</div>
      </div>
      <Link
        to={`/mypage/reviews/write/${item.id}`}
        state={item} // 작성 페이지로 구매항목 전달
        style={styles.primaryBtn}
      >
        리뷰 쓰기
      </Link>
    </div>
  );
}

/* ====== 카드: 작성한 후기 ====== */
function WrittenCard({ item }) {
  return (
    <div style={styles.card}>
      <img src={item.thumb} alt="" style={styles.thumb} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.titleRow}>
          <div style={styles.title}>{item.productName}</div>
          <div style={styles.meta}>{item.date}</div>
        </div>
        <div style={styles.meta}>옵션 {item.option} · {item.price}</div>
        <div style={{ marginTop: 6 }}>
          <Stars value={item.rating} />{" "}
          <span style={styles.snippet}>{item.text}</span>
        </div>
      </div>
      <Link to={`/mypage/reviews/${item.id}`} style={styles.arrowBtn} aria-label="리뷰 상세">
        ›
      </Link>
    </div>
  );
}

/* ====== 보조 컴포넌트 ====== */
function Stars({ value = 0, max = 5 }) {
  return (
    <span aria-label={`별점 ${value}/${max}`}>
      {"★".repeat(value)}
      <span style={{ color: "#ccc" }}>{"★".repeat(Math.max(0, max - value))}</span>
    </span>
  );
}

function EmptyState({ tab, onSeed }) {
  const text = tab === "todo" ? "작성할 후기가 없습니다." : "작성한 후기가 없습니다.";
  const showSeed = tab === "todo";
  return (
    <div style={{ textAlign: "center", color: "#777", padding: "32px 0" }}>
      <div>{text}</div>
      {showSeed && (
        <button onClick={onSeed} style={{ ...styles.seedBtn, marginTop: 10 }}>
          샘플 데이터 채우기
        </button>
      )}
    </div>
  );
}

/* ====== 스타일 ====== */
const styles = {
  page: {
    display: "grid",
    placeItems: "center",
    padding: "24px 16px",
    background: "#fafafa",
  },
  panel: {
    width: "min(720px, 92vw)",
    background: "#fff",
    border: "1.5px solid #ffccd5",
    borderRadius: 14,
    padding: 18,
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    margin: "6px 8px 10px",
  },
  tabBtn: {
    height: 36,
    borderRadius: 999,
    border: "1px solid #ffd5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  tabBtnActive: {
    background: "#ff7f93",
    color: "#fff",
    borderColor: "#ff7f93",
    fontWeight: 700,
  },
  seedBtn: {
    height: 30,
    padding: "0 10px",
    borderRadius: 999,
    border: "1px solid #ffd5db",
    background: "#fff",
    fontSize: 12,
    color: "#ff7f93",
    cursor: "pointer",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "80px 1fr auto",
    alignItems: "center",
    gap: 12,
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    margin: "10px 6px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  },
  thumb: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 10,
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
  },
  title: { fontWeight: 700, fontSize: 14 },
  meta: { fontSize: 12, color: "#777" },
  snippet: { fontSize: 13, color: "#444" },
  arrowBtn: {
    textDecoration: "none",
    color: "#777",
    fontSize: 22,
    textAlign: "right",
    padding: "0 6px",
  },
  primaryBtn: {
    textDecoration: "none",
    background: "#ff7f93",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
  },
};
