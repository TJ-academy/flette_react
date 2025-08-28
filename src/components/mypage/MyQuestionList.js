import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/mypage/myquestionlist.css'; // CSS 파일을 import 합니다.

export default function MyQuestionList() {
    const [rows, setRows] = useState([]);
    const [openId, setOpenId] = useState(null); // 펼친 행의 questionId
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const pageSize = 10; // 페이지 크기

    useEffect(() => {
        const userid = sessionStorage.getItem("loginId") || "guy123"; // 로그인 사용자
        axios
            .get("https://sure-dyane-flette-f3f77cc0.koyeb.app/api/mypage/qna", {
                params: { userid, page: currentPage, size: pageSize } // 페이지 번호와 크기를 파라미터로 전달
            })
            .then(({ data }) => {
                setRows(data.content || []); // 서버에서 받아온 content 배열
                setTotalPages(data.totalPages); // 전체 페이지 수
            })
            .catch(() => {
                setRows([]);
                setTotalPages(1);
            });
    }, [currentPage]);

    // 페이지 변경 처리
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 문의 삭제 버튼 클릭 시 백엔드에 삭제 요청을 보내는 함수
    const handleDelete = (e, questionId) => {
        e.stopPropagation(); // ✨ 중요: 이벤트 전파 중단

        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios
            .delete(`https://sure-dyane-flette-f3f77cc0.koyeb.app/api/mypage/qna/${questionId}`)
            .then(() => {
                // 삭제 후 목록을 다시 불러오거나 상태를 업데이트
                setRows((prevRows) => prevRows.filter((row) => row.questionId !== questionId));
                // 삭제 후 현재 페이지의 데이터가 1개뿐이었다면, 이전 페이지로 이동
                if (rows.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                }
            })
            .catch((error) => {
                console.error("삭제 실패", error);
                alert("문의 삭제에 실패했습니다.");
            });
    };

    return (
        <main className="page">
            <section className="wrap">
                <h2 className="heading">Q&amp;A</h2>

                <table className="table">
                    <thead>
                        <tr className="headRow">
                            <th className="th">답변 상태</th>
                            <th className="th" style={{ textAlign: "left" }}>제목</th>
                            <th className="th">작성자</th>
                            <th className="th">작성일</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="emptyCell">
                                    문의내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <React.Fragment key={r.questionId}>
                                    <tr
                                        className="row"
                                        onClick={() =>
                                            setOpenId(openId === r.questionId ? null : r.questionId)
                                        }
                                    >
                                        <td className="td">
                                            {r.answered ? (
                                                <Badge color="#ff8aa0" text="답변 완료" />
                                            ) : (
                                                <Badge color="#bbb" text="답변 대기" />
                                            )}
                                        </td>
                                        <td className="td" style={{ textAlign: "left" }}>
                                            {r.title}
                                        </td>
                                        <td className="td">{r.writerMasked}</td>
                                        <td className="td">{formatDate(r.questionDate)}</td>
                                    </tr>

                                    {openId === r.questionId && (
                                        <tr>
                                            <td colSpan={4} className="detailCell">
                                                <div className="qBox">
                                                    <div className="qTitle">질문</div>
                                                    <div className="qText">{r.questionContent}</div>
                                                </div>

                                                {r.answered && (
                                                    <div className="aBox">
                                                        <div className="aLabel">답변</div>
                                                        <div className="aMeta">
                                                            판매자 · {formatDate(r.answerDate)}
                                                        </div>
                                                        <div className="aText">{r.answerContent}</div>
                                                    </div>
                                                )}

                                                <div style={{ textAlign: "right", marginTop: 12 }}>
                                                    <button
                                                        className="lightBtn"
                                                        onClick={(e) => handleDelete(e, r.questionId)} // ✨ 중요: 이벤트 객체(e)를 전달
                                                    >
                                                        문의 삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 페이징 버튼 */}
                <div className="paging">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index)}
                            style={{
                                padding: "5px 10px",
                                margin: "0 5px",
                                cursor: "pointer",
                                backgroundColor: currentPage === index ? "#ff7f93" : "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                color: currentPage === index ? "#fff" : "#333",
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}

/* ===== utils & styles ===== */
function formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    const y = String(date.getFullYear()).slice(2);
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function Badge({ text, color }) {
    return (
        <span
            style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 999,
                border: `1px solid ${color}55`,
                background: `${color}22`,
                color,
            }}
        >
            {text}
        </span>
    );
}