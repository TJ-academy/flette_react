import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ConfirmModal from "./ConfirmModal";
import '../../css/admin/admin.css';

export default function MemberAdmin() {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  const showModal = (title, message, onConfirm = null) => {
    setModalState({ isOpen: true, title, message, onConfirm });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const fetchMembers = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/members", {
        params: { page, size: 10 },
      });
      const { content = [], totalPages = 1, number = page } = data || {};
      setList(content);
      setTotalPages(totalPages);
      setCurrentPage(number);
      setSelectedId(null);
    } catch (e) {
      console.error("회원 목록 조회 실패:", e.response?.data || e);
      showModal("오류", "회원 목록을 불러오는 데 실패했습니다.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(0);
  }, []);

  const onDelete = async (userid) => {
    showModal(
      "회원 삭제", 
      `정말 ${userid} 회원을 삭제하시겠습니까?`,
      async () => {
        try {
          await axios.delete(`/api/admin/members/${userid}`);
          showModal("성공", "회원 삭제에 성공했습니다.");
          await fetchMembers(currentPage);
        } catch (e) {
          console.error("회원 삭제 실패:", e.response?.data || e);
          showModal("오류", "회원 삭제에 실패했습니다.");
        }
      }
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return format(d, "yyyy-MM-dd");
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <main className="page">
      <section className="wrap">
        <h2 className="title">회원관리</h2>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="th">아이디</th>
                <th className="th">이름</th>
                <th className="th">가입일</th>
                <th className="th">상세 관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="empty">불러오는 중…</td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty">회원이 없습니다.</td>
                </tr>
              ) : (
                list.map((m) => (
                  <React.Fragment key={m.userid}>
                    <tr className="row">
                      <td className="td">{m.userid}</td>
                      <td className="td">{m.username}</td>
                      <td className="td">{formatDate(m.joinedAt)}</td>
                      <td className="td">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedId((prev) => (prev === m.userid ? null : m.userid))
                          }
                          className="outline-btn"
                        >
                          {selectedId === m.userid ? "닫기" : "상세보기"}
                        </button>
                      </td>
                    </tr>

                    {selectedId === m.userid && (
                      <tr>
                        <td colSpan={4} className="p-0">
                          <div className="detail-card">
                            <h3 className="detail-title">상세보기</h3>

                            <div className="detail-row">
                              <span className="label">아이디</span>
                              <span>{m.userid}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">이름</span>
                              <span>{m.username}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">가입일</span>
                              <span>{formatDate(m.joinedAt)}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">주소</span>
                              <span>
                                {[
                                  m.zipcode,
                                  m.address1,
                                  m.address2
                                ]
                                  .filter(Boolean)
                                  .join(" ") || "-"}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="label">연락번호</span>
                              <span>{m.tel || "-"}</span>
                            </div>

                            <div className="detail-btns">
                              <Link
                                to={`/admin/members/edit/${m.userid}`}
                                className="gray-btn no-underline"
                              >
                                수정
                              </Link>
                              <button
                                type="button"
                                className="primary-btn"
                                onClick={() => onDelete(m.userid)}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="paging">
          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => fetchMembers(p)}
              className={`page-dot ${currentPage === p ? 'page-active' : ''}`}
              aria-current={currentPage === p ? "page" : undefined}
            >
              {p + 1}
            </button>
          ))}
        </div>
      </section>
      <ConfirmModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={() => {
          if (modalState.onConfirm) {
            modalState.onConfirm();
          }
          closeModal();
        }}
        onCancel={closeModal}
      />
    </main>
  );
}
