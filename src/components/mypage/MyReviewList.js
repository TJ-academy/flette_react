// src/pages/MyReviewList.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function MyReviewList() {
    // ✅ JS에서는 이렇게
    const [tab, setTab] = useState("todo"); // "todo" | "done" 중 하나를 문자열로 관리


    // --- 더미 데이터 (API 연동 시 교체) ---
    // 주문 항목(구매 이력) 기준 데이터
    const purchases = [
        // reviewed === false → 작성할 후기
        { id: 9001, productName: "라이트 튤립 (소)", option: "크림/핑크", price: "19,800원", date: "2025.08.05", thumb: "https://picsum.photos/seed/ft1/80/80", reviewed: false },
        { id: 9002, productName: "가든 부케 (소)", option: "레드/화이트", price: "19,800원", date: "2025.08.01", thumb: "https://picsum.photos/seed/ft2/80/80", reviewed: false },

        // reviewed === true → 작성한 후기 (아래 reviews와 1:1은 아닐 수 있음)
        { id: 9101, productName: "커스텀 꽃다발 (중)", option: "옐로/피치", price: "29,800원", date: "2025.07.30", thumb: "https://picsum.photos/seed/ft3/80/80", reviewed: true },
    ];

    // 작성 완료된 리뷰 데이터 (상세 내용/별점 포함)
    const reviews = [
        { id: 101, purchaseId: 9101, productName: "커스텀 꽃다발 (중)", option: "옐로/피치", price: "29,800원", date: "2025.07.31", rating: 5, text: "색감이 정말 예뻐요. 선물 받는 분이 엄청 좋아했습니다!", thumb: "https://picsum.photos/seed/ft3/80/80" },
    ];

    const todoList = useMemo(
        () => purchases.filter(p => !p.reviewed),
        [purchases]
    );
    const doneList = reviews; // 이미 작성된 후기

    const list = tab === "todo" ? todoList : doneList;

    return (
        <main style={styles.page}>
            <section style={styles.panel}>
                {/* 탭 */}
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

                {/* 리스트 */}
                <div style={{ marginTop: 12 }}>
                    {list.length === 0 ? (
                        <EmptyState tab={tab} />
                    ) : (
                        list.map(item =>
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
                to={`/mypage/reviews/write/${item.id}`} // 리뷰 작성 페이지(주문항목 기준)
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

function EmptyState({ tab }) {
    const text = tab === "todo" ? "작성할 후기가 없습니다." : "작성한 후기가 없습니다.";
    return (
        <div style={{ textAlign: "center", color: "#777", padding: "32px 0" }}>
            {text}
        </div>
    );
}

/* ====== 스타일 ====== */
const styles = {
    page: {
        display: "grid",
        placeItems: "center",
        padding: "24px 16px",
        background: "#fafafa"
    },
    panel: {
        width: "min(720px, 92vw)",
        background: "#fff",
        border: "1.5px solid #ffccd5",
        borderRadius: 14,
        padding: 18
    },
    tabs: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        margin: "6px 8px 10px"
    },
    tabBtn: {
        height: 36,
        borderRadius: 999,
        border: "1px solid #ffd5db",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14
    },
    tabBtnActive: {
        background: "#ff7f93",
        color: "#fff",
        borderColor: "#ff7f93",
        fontWeight: 700
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
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
    },
    thumb: {
        width: 80,
        height: 80,
        objectFit: "cover",
        borderRadius: 10
    },
    titleRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8
    },
    title: { fontWeight: 700, fontSize: 14 },
    meta: { fontSize: 12, color: "#777" },
    snippet: { fontSize: 13, color: "#444" },
    arrowBtn: {
        textDecoration: "none",
        color: "#777",
        fontSize: 22,
        textAlign: "right",
        padding: "0 6px"
    },
    primaryBtn: {
        textDecoration: "none",
        background: "#ff7f93",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 999,
        fontSize: 13
    }
};
