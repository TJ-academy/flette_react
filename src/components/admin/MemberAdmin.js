import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Link 컴포넌트 추가
import { format } from "date-fns"; // 날짜 형식을 더 깔끔하게 처리하기 위한 라이브러리

export default function MemberAdmin() {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // 페이지가 변경될 때마다 회원 목록을 불러오는 함수
  const fetchMembers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/members", {
        params: { page: page, size: 10 },
      });
      const { content, totalPages: fetchedTotalPages } = response.data;
      setList(content);
      setTotalPages(fetchedTotalPages);
      setCurrentPage(page);
    } catch (e) {
      console.error("회원 목록 조회 실패:", e);
      alert("회원 목록을 불러오는 데 실패했습니다.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage]);

  // 회원 삭제 함수
  const onDelete = async (userid) => {
    if (!window.confirm(`정말 ${userid} 회원을 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await axios.delete(`/api/admin/members/${userid}`);
      alert("회원 삭제에 성공했습니다.");
      // 삭제 후 목록 새로고침
      fetchMembers(currentPage);
      // 상세보기 패널 닫기
      if (selected?.userid === userid) setSelected(null);
    } catch (e) {
      console.error("회원 삭제 실패:", e);
      alert("회원 삭제에 실패했습니다.");
    }
  };

  // 가입일 형식을 yyyy-MM-dd로 변환
  const formatDate = (dateStr) => {
    return dateStr ? format(new Date(dateStr), 'yyyy-MM-dd') : "-";
  };
  
  // 페이지네이션 버튼 렌더링을 위한 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <main style={st.page}>
      <section style={st.wrap}>
        <h2 style={st.title}>회원관리</h2>

        {/* 목록 테이블 */}
        <div style={st.tableWrap}>
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>아이디</th>
                <th style={st.th}>이름</th>
                <th style={st.th}>가입일</th>
                <th style={st.th}>상세 관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={st.empty}>불러오는 중…</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={4} style={st.empty}>회원이 없습니다.</td></tr>
              ) : (
                list.map((m) => (
                  <tr key={m.userid} style={st.row}>
                    <td style={st.td}>{m.userid}</td>
                    <td style={st.td}>{m.username}</td>
                    <td style={st.td}>{formatDate(m.joinedAt)}</td>
                    <td style={st.td}>
                      <button
                        type="button"
                        onClick={() => setSelected(m)}
                        style={st.outlineBtn}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 상세보기 패널 */}
        {selected && (
          <div style={st.detailCard}>
            <h3 style={st.detailTitle}>상세보기</h3>
            <div style={st.detailRow}>
              <span style={st.label}>아이디</span>
              <span>{selected.userid}</span>
            </div>
            <div style={st.detailRow}>
              <span style={st.label}>이름</span>
              <span>{selected.username}</span>
            </div>
            <div style={st.detailRow}>
              <span style={st.label}>가입일</span>
              <span>{formatDate(selected.joinedAt)}</span>
            </div>
            <div style={st.detailRow}>
              <span style={st.label}>주소</span>
              <span>{`${selected.zipcode} ${selected.address1} ${selected.address2}` ?? "-"}</span>
            </div>
            <div style={st.detailRow}>
              <span style={st.label}>연락번호</span>
              <span>{selected.tel ?? "-"}</span>
            </div>

            <div style={st.detailBtns}>
              <Link to={`/admin/members/edit/${selected.userid}`} style={{ ...st.grayBtn, textDecoration: 'none' }}>
                수정
              </Link>
              <button
                type="button"
                style={st.primaryBtn}
                onClick={() => onDelete(selected.userid)}
              >
                삭제
              </button>
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        <div style={st.paging}>
          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => fetchMembers(p)}
              style={{ ...st.pageDot, ...(currentPage === p ? st.pageActive : {}) }}
              aria-current={currentPage === p ? "page" : undefined}
            >
              {p + 1}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ========= styles ========= */
const st = {
  page: { display: "grid", placeItems: "center", padding: "24px 16px", background: "#fff" },
  wrap: { width: "min(920px, 94vw)" },

  title: {
    width: 160, margin: "0 auto 16px", textAlign: "center",
    background: "#ff88a0", color: "#fff", padding: "10px 0",
    borderRadius: 999, fontSize: 16, fontWeight: 700
  },

  tableWrap: { borderTop: "1px solid #f2b9c2", paddingTop: 10, marginTop: 6 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 8px", color: "#666", fontWeight: 700, borderBottom: "1px solid #eee", fontSize: 14 },
  row: { borderBottom: "1px solid #f4f4f4" },
  td: { padding: "10px 8px", textAlign: "center", fontSize: 14 },
  empty: { padding: "28px 8px", textAlign: "center", color: "#999" },

  outlineBtn: {
    padding: "8px 14px", border: "1px solid #f4b7c0", borderRadius: 999,
    background: "#fff", cursor: "pointer", color: "#444"
  },

  detailCard: {
    marginTop: 18, padding: 20, border: "1.5px solid #f4b7c0",
    background: "#fff6f8", borderRadius: 12, maxWidth: 560, marginInline: "auto"
  },
  detailTitle: { textAlign: "center", margin: "0 0 14px 0", fontSize: 18, fontWeight: 700 },
  detailRow: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, padding: "6px 2px" },
  label: { color: "#666" },

  detailBtns: { display: "flex", gap: 12, justifyContent: "center", marginTop: 14 },
  grayBtn: {
    padding: "10px 20px", borderRadius: 999, border: "none",
    background: "#f2f2f2", color: "#333", cursor: "pointer"
  },
  primaryBtn: {
    padding: "10px 20px", borderRadius: 999, border: "none",
    background: "#ff88a0", color: "#fff", cursor: "pointer", fontWeight: 700
  },

  paging: { textAlign: "center", marginTop: 18, color: "#aaa" },
  pageDot: { border: "none", background: "transparent", cursor: "pointer", padding: "4px 8px", borderRadius: 6 },
  pageActive: { color: "#ff7f93", fontWeight: 700 }
};

/* ========= utils ========= */
function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return d; // 이미 yyyy-MM-dd 형태면 그대로
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
