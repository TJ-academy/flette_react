// src/pages/MainPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/main.css";

function Main() {
  const thumbs = [
    "https://picsum.photos/seed/flower1/300/200",
    "https://picsum.photos/seed/flower2/300/200",
    "https://picsum.photos/seed/flower3/300/200",
    "https://picsum.photos/seed/flower4/300/200",
    "https://picsum.photos/seed/flower5/300/200",
    "https://picsum.photos/seed/flower6/300/200",
  ];
  const [startIdx, setStartIdx] = useState(0);
  const [dim, setDim] = useState(false);
  const visible = 5;

  const move = (dir) => {
    setStartIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next > thumbs.length - visible) return Math.max(thumbs.length - visible, 0);
      return next;
    });
  };

  return (
    <main className="page">
      {/* HERO */}
      <section className={`hero ${dim ? 'is-dim' : ''}`}>
        <img src={require("../resources/images/main_banner.png")} alt="메인 배너" className="hero-bg" />
        <div className="hero-overlay">
          <h1 className="hero-title">Custom<br/>Your<br/>Love</h1>
          <p className="hero-desc">
            메인 꽃과 서브 꽃, 포장 방식까지<br/>
            직접 골라 마음을 전해 보세요!          </p>
          <Link
            to="/shop"
            className="primary-btn"
            onMouseEnter={() => setDim(true)}
            onMouseLeave={() => setDim(false)}
          >
          &nbsp;&nbsp;&nbsp;&nbsp;
          직접 커스텀하러 가기
          &nbsp;&nbsp;&nbsp;&nbsp;
          </Link>
        </div>
      </section>
      {/* PHOTO REVIEW */}
      <section className="reviews">
        <h3 className="section-title">포토 리뷰 보기</h3>

        <div className="carousel-wrap">
          <button aria-label="prev" onClick={() => move(-1)} className="arrow-btn">
            <img src="/img/arrow_left.png" alt="이전" className="arrow-icon" />
          </button>

          <div className="carousel">
            {thumbs.slice(startIdx, startIdx + visible).map((src) => (
              <Link to="/reviews" key={src} className="thumb-card">
                <img src={src} alt="" className="thumb-img" />
              </Link>
            ))}
          </div>

          <button aria-label="next" onClick={() => move(1)} className="arrow-btn">
            <img src="/img/arrow_left.png" alt="다음" className="arrow-icon arrow-right" />
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <Link to="/reviews" className="outline-btn">더 보기</Link>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="banner">
        <img
          src={require("../resources/images/test_banner.png")}
          alt=""
          className="banner-img"
        />
        <div className="banner-content">
          <div className="banner-left">
            <div className="banner-ment">당신과 어울리는 꽃을 알아볼까요?</div>
            <Link to="/survey/start" className="primary-btn-sm">
              테스트 하러 가기
            </Link>
          </div>
          <div className="banner-copy">find the flower<br/>for you</div>
        </div>
      </section>

    </main>
  );
}

export default Main;
