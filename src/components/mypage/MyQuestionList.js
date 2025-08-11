// src/pages/MyQnaList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyQuestionList() {
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState(null); // 펼친 행의 questionId

  useEffect(() => {
    const userid = sessionStorage.getItem("loginId") || "guy123"; // 로그인 사용자
    axios
      .get("/api/mypage/qna", { params: { userid } })
      .then(({ data }) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]));
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.wrap}>
        <h2 style={styles.heading}>Q&amp;A</h2>

        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              <th style={styles.th}>답변 상태</th>
              <th style={{ ...styles.th, textAlign: "left" }}>제목</th>
              <th style={styles.th}>작성자</th>
              <th style={styles.th}>작성일</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} style={styles.emptyCell}>
                  문의내역이 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <React.Fragment key={r.questionId}>
                  <tr
                    style={styles.row}
                    onClick={() =>
                      setOpenId(openId === r.questionId ? null : r.questionId)
                    }
                  >
                    <td style={styles.td}>
                      {r.answered ? (
                        <Badge color="#ff8aa0" text="답변 완료" />
                      ) : (
                        <Badge color="#bbb" text="답변 대기" />
                      )}
                    </td>
                    <td style={{ ...styles.td, textAlign: "left" }}>
                      {r.title}
                    </td>
                    <td style={styles.td}>{r.writerMasked}</td>
                    <td style={styles.td}>{formatDate(r.questionDate)}</td>
                  </tr>

                  {openId === r.questionId && (
                    <tr>
                      <td colSpan={4} style={styles.detailCell}>
                        <div style={styles.qBox}>
                          <div style={styles.qTitle}>질문</div>
                          <div style={styles.qText}>{r.questionContent}</div>
                        </div>

                        {r.answered && (
                          <div style={styles.aBox}>
                            <div style={styles.aLabel}>답변</div>
                            <div style={styles.aMeta}>
                              판매자 · {formatDate(r.answerDate)}
                            </div>
                            <div style={styles.aText}>{r.answerContent}</div>
                          </div>
                        )}

                        <div style={{ textAlign: "right", marginTop: 12 }}>
                          <button style={styles.lightBtn}>
                            답변 삭제가 필요할까요..?
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

        <div style={styles.paging}>1 2 3 4 5</div>
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

const styles = {
  page: {
    display: "grid",
    placeItems: "center",
    padding: "24px 16px",
    background: "#fafafa",
  },
  wrap: { width: "min(920px, 94vw)" },
  heading: {
    background: "#ff7f93",
    color: "#fff",
    textAlign: "center",
    padding: "12px 0",
    borderRadius: "8px 8px 0 0",
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #f3c6c9",
    borderTop: "none",
  },
  headRow: { background: "#fff3f4" },
  th: { padding: "12px 8px", borderBottom: "1px solid #f3c6c9", fontSize: 14 },
  row: { cursor: "pointer", borderBottom: "1px solid #f3c6c9" },
  td: { padding: "10px 8px", textAlign: "center", fontSize: 14 },
  detailCell: {
    background: "#fff",
    padding: "16px",
    borderBottom: "1px solid #f3c6c9",
  },

  qBox: {
    padding: "12px 14px",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 8,
  },
  qTitle: { fontWeight: 700, marginBottom: 6 },
  qText: { whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#444" },

  aBox: {
    marginTop: 12,
    padding: "14px",
    background: "#f7f7f9",
    border: "1px solid #eee",
    borderRadius: 8,
  },
  aLabel: {
    display: "inline-block",
    marginBottom: 6,
    padding: "2px 8px",
    borderRadius: 6,
    background: "#333",
    color: "#fff",
    fontSize: 12,
  },
  aMeta: { fontSize: 12, color: "#777", marginBottom: 6 },
  aText: { whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#333" },

  lightBtn: {
    border: "1px solid #ddd",
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 999,
    cursor: "pointer",
  },
  paging: { textAlign: "center", padding: "12px", color: "#999" },

  emptyCell: {
    padding: "36px 8px",
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
};
