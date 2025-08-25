import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

export default function MyReviewWrite() {
    const { bouquetCode } = useParams();
    const navigate = useNavigate();

    const [productInfo, setProductInfo] = useState(null);
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
        const fetchProductInfo = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`/api/reviews/write-info/${bouquetCode}`);
                setProductInfo(response.data);
            } catch (err) {
                console.error("상품 정보를 불러오는 데 실패했습니다.", err);
                setError("상품 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductInfo();
    }, [bouquetCode]);

    const onFiles = (e) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files].slice(0, 5));
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

        // FormData 객체 생성
        const formData = new FormData();

        // JSON 데이터 추가
        const reviewData = {
            bouquetCode: productInfo.bouquetCode,
            productId: productInfo.productId,
            reviewContent: text,
            reviewImage: images.length > 0 ? images[0].name : null,
            score: rating,
            writer: productInfo.userId,
            luv: 0,
        };
        formData.append("reviewData", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));

        // 이미지 파일 추가
        images.forEach((image) => {
            formData.append("reviewImages", image);
        });

        try {
            // FormData를 포함한 POST 요청
            const response = await axios.post("/api/reviews/save", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("리뷰 저장 성공:", response.data);
            alert("리뷰가 성공적으로 등록되었습니다!");
            //productInfo.productId
            navigate(`/shop/${productInfo.productId}/detail#reviews`, { state: { tab: "done" } });
        } catch (err) {
            console.error("리뷰 저장 실패:", err.response ? err.response.data : err.message);
            alert("리뷰 저장에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    if (loading) {
        return <div className="loading-message">상품 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!productInfo) {
        return <div className="not-found-message">상품 정보를 찾을 수 없습니다.</div>;
    }

    const formatPrice = (price) => {
        return price ? price.toLocaleString() + "원" : "0원";
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };
    const optionString = [productInfo.mainAFlowerName, productInfo.mainBFlowerName, productInfo.mainCFlowerName]
        .filter(Boolean)
        .join(' / ');

    return (
        <main style={styles.page}>
            <section style={styles.panel}>
                <div style={styles.headerRow}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ ...styles.backBtn, border: 'none', background: 'none' }}
                        aria-label="뒤로가기"
                    >
                        ←
                    </button>
                    <h2 style={{ margin: 50, fontSize: 18 }}>리뷰쓰기</h2>
                    <div style={{ width: 24 }} />
                </div>

                <div style={{ textAlign: "center", marginTop: 14 }}>
                    <img src={`/img/product/${productInfo.imageName}`} alt={productInfo.productName} style={styles.hero} />
                    <div style={{ marginTop: 8, color: "#666" }}>{productInfo.productName}</div>
                    <div style={{ fontSize: 12, color: "#9c9c9c" }}>
                        옵션 {optionString} · {formatPrice(productInfo.totalMoney)} · {formatDate(productInfo.orderDate)}
                    </div>
                </div>

                <hr style={styles.divider} />

                <form onSubmit={onSubmit}>
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