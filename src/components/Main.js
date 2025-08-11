// src/pages/MainPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  // 썸네일 더미 이미지
  const thumbs = [
    "https://picsum.photos/seed/flower1/300/200",
    "https://picsum.photos/seed/flower2/300/200",
    "https://picsum.photos/seed/flower3/300/200",
    "https://picsum.photos/seed/flower4/300/200",
    "https://picsum.photos/seed/flower5/300/200",
    "https://picsum.photos/seed/flower6/300/200",
  ];
  const [startIdx, setStartIdx] = useState(0);
  const visible = 5; // 한 화면에 보이는 썸네일 수

  const move = (dir) => {
    setStartIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next > thumbs.length - visible) return Math.max(thumbs.length - visible, 0);
      return next;
    });
  };

  return (
    <main style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>
            <span>Custom</span>
            <br />
            <span>Your</span>
            <br />
            <span>Love</span>
          </h1>
          <p style={styles.heroDesc}>
            매일 달라 새롭고, 포근한 꽃향기와
            <br />
            직접 고른 아름다움을 담아 선물하세요!
          </p>
          <Link to="/custom" style={styles.primaryBtn}>
            직접 커스텀하러 가기
          </Link>
        </div>

        <div style={styles.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
            alt="메인 부케"
            style={styles.heroImage}
          />
        </div>
      </section>

      {/* PHOTO REVIEW */}
      <section style={styles.reviews}>
        <h3 style={styles.sectionTitle}>포토 리뷰 보기</h3>

        <div style={styles.carouselWrap}>
          <button aria-label="prev" onClick={() => move(-1)} style={styles.arrowBtn}>
            ‹
          </button>

          <div style={styles.carousel}>
            {thumbs.slice(startIdx, startIdx + visible).map((src, i) => (
              <Link to="/reviews" key={src} style={styles.thumbCard}>
                <img src={src} alt="" style={styles.thumbImg} />
              </Link>
            ))}
          </div>

          <button aria-label="next" onClick={() => move(1)} style={styles.arrowBtn}>
            ›
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <Link to="/reviews" style={styles.outlineBtn}>더 보기</Link>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section style={styles.banner}>
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
          alt=""
          style={styles.bannerImg}
        />
        <div style={styles.bannerContent}>
          <Link to="/test" style={styles.primaryBtnSm}>테스트 하러 가기</Link>
          <div style={styles.bannerCopy}>find the flower<br/>for you</div>
        </div>
      </section>
    </main>
  );
}

/* ========== styles ========== */
const styles = {
  page: { paddingBottom: 60, background: "#fff" },

  /* HERO */
  hero: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: 24,
    alignItems: "center",
    padding: "40px 24px",
    background: "#f7efe6",
  },
  heroLeft: { paddingLeft: 12 },
  heroTitle: {
    margin: 0,
    fontSize: 72,
    lineHeight: 1,
    letterSpacing: 1,
    color: "#29402d",
    fontWeight: 800,
  },
  heroDesc: { marginTop: 16, color: "#5a5a5a", fontSize: 16 },
  primaryBtn: {
    display: "inline-block",
    marginTop: 20,
    padding: "12px 20px",
    borderRadius: 999,
    background: "#ff8092",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  heroRight: { textAlign: "right" },
  heroImage: {
    width: "100%",
    maxWidth: 540,
    height: "auto",
    borderRadius: 12,
    objectFit: "cover",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  /* REVIEWS */
  reviews: { padding: "36px 24px" },
  sectionTitle: { textAlign: "center", margin: "0 0 14px 0", fontSize: 20, fontWeight: 800 },
  carouselWrap: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 40px",
    alignItems: "center",
    gap: 8,
    maxWidth: 960,
    margin: "0 auto",
  },
  arrowBtn: {
    border: "1px solid #eee",
    background: "#fff",
    width: 36,
    height: 36,
    borderRadius: "50%",
    fontSize: 22,
    cursor: "pointer",
  },
  carousel: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
  },
  thumbCard: {
    display: "block",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  thumbImg: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    display: "block",
  },
  outlineBtn: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: 999,
    border: "1px solid #ddd",
    color: "#333",
    textDecoration: "none",
    background: "#fff",
  },

  /* BANNER */
  banner: {
    position: "relative",
    maxWidth: 960,
    margin: "28px auto 0",
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerImg: { width: "100%", height: 220, objectFit: "cover", filter: "saturate(95%)" },
  bannerContent: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 28px",
  },
  primaryBtnSm: {
    padding: "10px 16px",
    borderRadius: 999,
    background: "#ff8092",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  bannerCopy: {
    color: "#fff",
    textAlign: "right",
    fontSize: 28,
    lineHeight: 1.1,
    textShadow: "0 2px 8px rgba(0,0,0,0.25)",
    fontWeight: 800,
  },

  /* 반응형 */
  "@media (max-width: 900px)": {}, // (별도 CSS 파일로 옮기면 미디어쿼리 쉽게 확장 가능)
};

export default Main;