import React, { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";


const LS_KEY = "flette-reviews";


const loadState = () => {
  try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
};
const saveState = (state) => localStorage.setItem(LS_KEY, JSON.stringify(state));
const findPurchaseFromLS = (id) => {
  const st = loadState();
  return st?.purchases?.find(p => p.id === Number(id)) || null;
};


function useMockPurchase(purchaseId) {
  return useMemo(
    () => ({
      id: Number(purchaseId),
      productName: "라이트 튤립 (소)",
      option: "크림/핑크",
      price: "19,800원",
      date: "2025.08.05",
      thumb: "https://picsum.photos/seed/ft1/640/360",
    }),
    [purchaseId]
  );
}

export default function MyReviewWrite() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  const fromState = location.state;
  const fallback = useMockPurchase(purchaseId);
  const p = fromState ?? findPurchaseFromLS(purchaseId) ?? fallback;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // File[]
  const fileRef = useRef(null);

  const MAX = 1000;
  const remain = MAX - text.length;

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 5)); // 최대 5장
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!rating) return alert("별점을 선택해주세요.");
    if (!text.trim()) return alert("리뷰 내용을 입력해주세요.");

    
    const current = loadState() || { purchases: [], reviews: [] };
    let purchases = current.purchases || [];
    let reviews = current.reviews || [];

    
    const d = new Date();
    const date = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
    const newReview = {
      id: Date.now(),
      purchaseId: p.id,
      productName: p.productName,
      option: p.option,
      price: p.price,
      date,
      rating,
      text,
      thumb: p.thumb,
      imageCount: images.length,
    };

    
    if (purchases.some(x => x.id === p.id)) {
      purchases = purchases.map(x => x.id === p.id ? { ...x, reviewed: true } : x);
    } else {
      purchases = [{ ...p, reviewed: true }, ...purchases];
    }

    
    reviews = [newReview, ...reviews];

    
    saveState({ purchases, reviews });

    alert("리뷰가 등록되었습니다!");
    navigate("/mypage/reviews", { state: { tab: "done" } });
  };

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        {/* 헤더 */}
        <div style={styles.headerRow}>
          <Link to="/mypage/reviews" style={styles.backBtn} aria-label="뒤로가기">
            ←
          </Link>
          <h2 style={{ margin: 50, fontSize: 18 }}>리뷰쓰기</h2>
          <div style={{ width: 24 }} /> {/* 균형용 */}
        </div>

        {/* 상품 정보 */}
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <img src={p.thumb} alt="" style={styles.hero} />
          <div style={{ marginTop: 8, color: "#666" }}>{p.productName}</div>
          <div style={{ fontSize: 12, color: "#9c9c9c" }}>
            옵션 {p.option} · {p.price} · {p.date}
          </div>
        </div>

        <hr style={styles.divider} />

        {/* 폼 */}
        <form onSubmit={onSubmit}>
          {/* 별점 */}
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <div style={styles.sectionTitle}>상품에 만족하셨나요?</div>
            <div style={styles.starRow} aria-label="별점 선택">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  style={styles.starBtn}
                  aria-label={`${n}점`}
                >
                  <span style={{ color: (hover || rating) >= n ? "#ff7f93" : "#ddd" }}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <div style={styles.caption}>
              {rating ? `별 ${rating}개 선택` : "선택해주세요."}
            </div>
          </div>

          {/* 내용 */}
          <div style={{ marginTop: 22 }}>
            <div style={styles.sectionTitle}>어떤 점이 좋았나요?</div>
            <textarea
              value={text}
              placeholder="자세한 리뷰를 적어주세요."
              onChange={(e) => e.target.value.length <= MAX && setText(e.target.value)}
              rows={8}
              style={styles.textarea}
            />
            <div style={styles.counter}>
              {remain} / {MAX}
            </div>
          </div>

          {/* 사진 업로드 */}
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={styles.photoBtn}
            >
              <span style={{ marginRight: 6 }}>📷</span> 사진 첨부하기
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onFiles}
            />
            {images.length > 0 && (
              <div style={styles.previewGrid}>
                {images.map((f, i) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <div key={i} style={styles.previewCell} title={f.name}>
                      <img
                        src={url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 제출 */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={!rating || !text.trim()}
            >
              리뷰 등록하기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}


const styles = {
 
  page: {
    display: "grid",
    placeItems: "center",
    padding: "32px 16px",
    background: "#fff",
  },


  panel: {
    width: "min(640px, 92vw)",       
    background: "#fff",
    padding: 24,
  },


  headerRow: {
    display: "grid",
    gridTemplateColumns: "24px 1fr 24px",
    alignItems: "center",
    marginBottom: 10,
  },
  backBtn: {
    textDecoration: "none",
    color: "#a3a3a3",
    fontSize: 20,
    lineHeight: "24px",
  },
  title: {
    margin: 0,
    fontSize: 20,                     
    fontWeight: 700,
    color: "#222",
    textAlign: "center",
  },


  hero: {
    width: "min(560px, 92%)",
    height: 220,
    objectFit: "cover",
    borderRadius: 20,
    margin: "8px auto 10px",
    display: "block",
  },
  imageCaption: {
    textAlign: "center",
    fontSize: 12,
    color: "#8a8a8a",
    marginTop: 4,
  },

  // 섹션 구분선
  divider: {
    margin: "20px 0",
    border: 0,
    borderTop: "1px solid #ffc9d3",  
  },


  sectionTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "#3d3d3d",
    textAlign: "center",
  },
  caption: {
    fontSize: 12,
    color: "#b0b0b0",
    marginTop: 6,
    textAlign: "center",
  },


  starRow: {
    fontSize: 28,
    letterSpacing: 5,                
    marginTop: 8,
    textAlign: "center",
  },
  starBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "2px 6px",
  },


  textarea: {
    width: "95%",
    minHeight: 150,                   
    border: "1px solid #e6e6e6",
    padding: 16,
    background: "#fff",
    resize: "vertical",
    outline: "none",
    lineHeight: 1.6,
    fontFamily: "inherit",
    marginTop: 10,
  },
  counter: {
    textAlign: "right",
    fontSize: 12,
    color: "#9b9b9b",
    
  },


  photoBtn: {
    width: "100%",
    height: 44,
    border: "1px solid #ededed",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    color: "#4a4a4a",
  },


  previewGrid: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(5, 90px)",
    gap: 8,
  },
  previewCell: {
    width: 90,
    height: 90,
    overflow: "hidden",
    borderRadius: 12,
    border: "1px solid #eee",
  },

  divider: {
    margin: "20px 0",
    border: 0,
    borderTop: "1px solid #ffc9d3",   
  },


  submitBtn: {
    minWidth: 100,
    height: 48,
    borderRadius: 20,
    background: "#ff7f93",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
   
  },
};
