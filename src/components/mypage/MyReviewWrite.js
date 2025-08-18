import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

export default function MyReviewWrite() {
    const { bouquetCode } = useParams(); // URL 파라미터에서 bouquetCode를 가져옴
    const navigate = useNavigate();

    const [productInfo, setProductInfo] = useState(null); // API에서 가져온 상품 정보를 저장할 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState("");
    const [images, setImages] = useState([]); // File[]
    const fileRef = useRef(null);

    const MAX = 1000;
    const remain = MAX - text.length;

    useEffect(() => {
        // API 호출 함수
        const fetchProductInfo = async () => {
            try {
                setLoading(true);
                setError(null);
                // 백엔드 API 호출: bouquetCode로 상품 정보 조회
                const response = await axios.get(`/api/reviews/write-info/${bouquetCode}`);
                setProductInfo(response.data); // 응답 데이터를 상태에 저장
            } catch (err) {
                console.error("상품 정보를 불러오는 데 실패했습니다.", err);
                setError("상품 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductInfo();
    }, [bouquetCode]); // bouquetCode가 변경될 때마다 재호출

    const onFiles = (e) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files].slice(0, 5)); // 최대 5장
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            alert("별점을 선택해주세요.");
            return;
        }
        if (!text.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        // 백엔드에 보낼 데이터 객체 생성
        const reviewData = {
            bouquetCode: productInfo.bouquetCode,
            productId: productInfo.productId,
            reviewContent: text,
            reviewImage: images.length > 0 ? images[0].name : null, // 첫 번째 이미지의 파일명만 저장한다고 가정
            score: rating,
            writer: productInfo.userId,
            luv: 0, // 초기 '좋아요' 수는 0
        };

        try {
            // 백엔드 API 호출: POST 요청으로 리뷰 데이터 전송
            const response = await axios.post("/api/reviews/save", reviewData);
            console.log("리뷰 저장 성공:", response.data);
            alert("리뷰가 성공적으로 등록되었습니다!");
            navigate("/mypage/reviews", { state: { tab: "done" } });
        } catch (err) {
            console.error("리뷰 저장 실패:", err.response ? err.response.data : err.message);
            alert("리뷰 저장에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    // 로딩 및 에러 처리 UI
    if (loading) {
        return <div className="loading-message">상품 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!productInfo) {
        return <div className="not-found-message">상품 정보를 찾을 수 없습니다.</div>;
    }

    // 데이터 포맷팅
    const formatPrice = (price) => {
        return price ? price.toLocaleString() + "원" : "0원";
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };
    // 옵션 정보 (메인 꽃 이름들로 조합)
    const optionString = [productInfo.mainAFlowerName, productInfo.mainBFlowerName, productInfo.mainCFlowerName]
        .filter(Boolean) // null이나 빈 문자열 제거
        .join(' / ');

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

                {/* 상품 정보 (실제 데이터로 교체) */}
                <div style={{ textAlign: "center", marginTop: 14 }}>
                    <img src={`/img/product/${productInfo.imageName}`} alt={productInfo.productName} style={styles.hero} />
                    <div style={{ marginTop: 8, color: "#666" }}>{productInfo.productName}</div>
                    <div style={{ fontSize: 12, color: "#9c9c9c" }}>
                        옵션 {optionString} · {formatPrice(productInfo.totalMoney)} · {formatDate(productInfo.orderDate)}
                    </div>
                </div>

                <hr style={styles.divider} />

                {/* 폼 (기존과 동일) */}
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
                    <hr style={styles.divider} />

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

// 스타일은 변경하지 않았습니다. 기존 스타일을 그대로 사용합니다.
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
        width: "calc(100% + 48px)",
        marginLeft: "-24px",
    },
    submitBtn: {
        minWidth: 300,
        height: 48,
        borderRadius: 25,
        background: "#ff7f93",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        border: "none",
        outline: "none",
        boxShadow: "none",
    },
};
