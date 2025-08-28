// src/pages/MainPage.jsx (또는 main.js)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/main.css";

function Main() {
  // --- 리뷰 데이터 상태 ---
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  // --- 히어로/캐러셀 상태 ---
  const [startIdx, setStartIdx] = useState(0);
  const [dim, setDim] = useState(false);
  const visible = 5;

  // 리뷰 일부(썸네일용) 조회 — ReviewsIndex와 같은 API 사용
  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setErr(null);

    axios
      .get("https://sure-dyane-flette-f3f77cc0.koyeb.app/api/all/reviews?page=1&size=20")
      .then((res) => {
        if (ignore) return;
        // ✅ 서버 응답의 content 속성에서 리뷰 배열을 가져옵니다.
        const list = res.data?.content || [];
        setReviews(list);
      })
      .catch((e) => {
        if (ignore) return;
        console.error("리뷰 불러오기 실패:", e);
        setErr("리뷰 불러오기를 실패했습니다.");
      })
      .finally(() => {
        if (ignore) return;
        setIsLoading(false);
      });

    return () => { ignore = true; };
  }, []);

  const move = (dir) => {
    setStartIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next > reviews.length - visible) return Math.max(reviews.length - visible, 0);
      return next;
    });
  };

  const renderThumbs = () => {
    if (isLoading) {
      return (
        <div className="carousel skeleton">
          {Array.from({ length: visible }).map((_, i) => (
            <div key={i} className="thumb-card skeleton-box" />
          ))}
        </div>
      );
    }
    if (err) return <div className="carousel-error">{err}</div>;
    if (!reviews.length) return <div className="carousel-empty">아직 등록된 포토 리뷰가 없습니다.</div>;

    return (
      <div className="carousel">
        {reviews.slice(startIdx, startIdx + visible).map((r) => (
          <Link to="/reviews" key={r.reviewId} className="thumb-card">
            <img
              src={`https://sure-dyane-flette-f3f77cc0.koyeb.app/img/reviews/${r.reviewImage}`} // ReviewsIndex와 동일 규칙
              alt={r.reviewId}
              className="thumb-img"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* ===== HERO: full-bleed로 좌우 끝까지 꽉 차게 ===== */}
      <section className={`hero full-bleed ${dim ? "is-dim" : ""}`}>
        <img
          src={require("../resources/images/main_banner.png")}
          alt="메인 배너"
          className="hero-bg"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">
            Custom<br />Your<br />Love
          </h1>
          <p className="hero-desc">
            메인 꽃과 서브 꽃, 포장 방식까지<br />
            직접 골라 마음을 전해 보세요!
          </p>
          <Link
            to="/shop"
            className="primary-btn"
            onMouseEnter={() => setDim(true)}
            onMouseLeave={() => setDim(false)}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;직접 커스텀하러 가기&nbsp;&nbsp;&nbsp;&nbsp;
          </Link>
        </div>
      </section>

      {/* 이하부터는 중앙 1200px 컨테이너 */}
      <main className="page">
        <br />
        <br />

        {/* ===== PHOTO REVIEW 미리보기 ===== */}
        <section className="reviews">
          <h3 className="section-title">포토 리뷰 보기</h3>
          <br />
          <div className="carousel-wrap">
            <button
              aria-label="prev"
              onClick={() => move(-1)}
              className="arrow-btn"
              disabled={isLoading || reviews.length <= visible || startIdx === 0}
            >
              <img src="/img/arrow_left.png" alt="이전" className="arrow-icon" />
            </button>

            {renderThumbs()}

            <button
              aria-label="next"
              onClick={() => move(1)}
              className="arrow-btn"
              disabled={
                isLoading || reviews.length <= visible || startIdx >= reviews.length - visible
              }
            >
              <img src="/img/arrow_left.png" alt="다음" className="arrow-icon arrow-right" />
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <Link to="/reviews" className="outline-btn">더 보기</Link>
          </div>
        </section>

        {/* ===== PROMO BANNER (그냥 페이지 컨테이너 내부) ===== */}
        <section className="banner">
          <div className="banner-content">
            <div className="banner-left">
              <div className="banner-ment">당신과 어울리는 꽃을 알아볼까요?</div>
              <Link to="/survey/start" className="primary-btn-sm">
                테스트 하러 가기
              </Link>
            </div>
            <div className="banner-copy">
              find the flower<br />for you
            </div>
          </div>
        </section>

        <br />
        <br />
        <br />
      </main>
    </>
  );
}

export default Main;
