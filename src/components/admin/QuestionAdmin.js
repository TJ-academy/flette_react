import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge, fmt } from "../../utils/utils";
import ConfirmModal from "./ConfirmModal";
import '../../css/admin/admin.css';

export default function QuestionAdmin() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [editor, setEditor] = useState({ id: null, text: "" });
  const [isUnansweredOnly, setIsUnansweredOnly] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  const showModal = (title, message, onConfirm = null) => {
    setModalState({ isOpen: true, title, message, onConfirm });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const fetchList = async (p = 0, unanswered = isUnansweredOnly) => {
    try {
      const { data } = await axios.get("/api/admin/qna", {
        params: { 
          page: p, 
          size: 10,
          unanswered: unanswered 
        }
      });
      setRows(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.number || p);
    } catch (e) {
      console.error(e);
      setRows([]);
    }
  };

  useEffect(() => { 
    fetchList(0, isUnansweredOnly);
  }, [isUnansweredOnly]);

  const openRow = (q) => {
    setOpenId(openId === q.questionId ? null : q.questionId);
    setEditor({ id: null, text: "" });
  };

  const submitAnswer = async (q) => {
  if (!editor.text.trim()) {
    showModal("입력 오류", "내용을 입력하세요.");
    return;
  }
  try {
    // Send the answer to the backend
    await axios.post(`/api/admin/qna/${q.questionId}/answer`, { answerContent: editor.text });
    await fetchList(page); // Reload the list of questions
    setEditor({ id: null, text: "" }); // Reset editor state
    showModal("성공", "답변이 성공적으로 등록되었습니다.", closeModal);
  } catch (e) {
    showModal("오류", "답변 등록에 실패했습니다.");
  }
};

  const updateAnswer = async (q) => {
    if (!editor.text.trim()) {
      showModal("입력 오류", "내용을 입력하세요.");
      return;
    }
    try {
      // 🚨 백틱(``)으로 수정
      await axios.put(`/api/admin/qna/${q.questionId}/answer`, { answerContent: editor.text });
      await fetchList(page);
      setEditor({ id: null, text: "" });
      showModal("성공", "답변이 성공적으로 수정되었습니다.", closeModal);
    } catch (e) {
      showModal("오류", "답변 수정에 실패했습니다.");
    }
  };

  const deleteAnswer = async (q) => {
    showModal("삭제 확인", "정말 삭제하시겠습니까?", async () => {
      try {
        // 🚨 백틱(``)으로 수정
        await axios.delete(`/api/admin/qna/${q.questionId}/answer`);
        await fetchList(page);
        showModal("성공", "답변이 삭제되었습니다.");
      } catch (e) {
        showModal("오류", "답변 삭제에 실패했습니다.");
      }
    });
  };

  return (
    <main className="page">
      <section className="wrap">
        <header className="header">
          <h2 className="title">Q&amp;A</h2>
          <div className="unanswered-toggle">
            <input 
              type="checkbox"
              id="unanswered-only"
              checked={isUnansweredOnly}
              onChange={() => setIsUnansweredOnly(!isUnansweredOnly)}
            />
            <label htmlFor="unanswered-only">미답변만 보기</label>
          </div>
        </header>
        <table className="table">
          <thead>
            <tr className="head-row">
              <th className="th">답변 상태</th>
              <th className="th text-left">제목</th>
              <th className="th">작성자</th>
              <th className="th">작성일</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} className="empty">데이터가 없습니다.</td></tr>
            ) : rows.map(q => (
              <React.Fragment key={q.questionId}>
                <tr className="row" onClick={() => openRow(q)}>
                  <td className="td">
                    <Badge text={q.answered ? "답변 완료" : "답변 대기"} color={q.answered ? "#ff8aa0" : "#bbb"} />
                  </td>
                  <td className="td text-left">{q.title}</td>
                  <td className="td">{q.writerMasked}</td>
                  <td className="td">{fmt(q.questionDate)}</td>
                </tr>

                {openId === q.questionId && (
                  <tr>
                    <td colSpan={4} className="detail-cell">
                      {/* 질문 본문 */}
                      <div className="q-box">
                        <div className="q-title">질문</div>
                        <div className="q-text">{q.questionContent}</div>
                      </div>

                      {/* 답변 영역 */}
                      {!q.answered ? (
                        <div className="edit-box">
                          <textarea
                            value={editor.id === q.questionId ? editor.text : ""}
                            onChange={(e) => setEditor({ id: q.questionId, text: e.target.value.slice(0,1000) })}
                            className="textarea"
                            placeholder="내용을 입력하세요."
                          />
                          <div className="edit-foot">
                            <span className="text-sm text-gray-500">
                              {(editor.id === q.questionId ? editor.text.length : 0)}/1000
                            </span>
                            <button className="pBtn" onClick={() => submitAnswer(q)}>등록</button>
                          </div>
                        </div>
                      ) : (
                        <div className="a-box">
                          <div className="a-label">답변</div>
                          <div className="a-meta">판매자 · {fmt(q.answerDate)}</div>
                          <div className="a-text">{q.answerContent}</div>

                          {editor.id === q.questionId ? (
                            <>
                              <textarea
                                value={editor.text}
                                onChange={(e)=> setEditor({ id: q.questionId, text: e.target.value.slice(0,1000) })}
                                className="textarea mt-10"
                              />
                              <div className="btn-row">
                                <button className="gray-btn" onClick={() => setEditor({ id:null, text:"" })}>취소</button>
                                <button className="pBtn" onClick={() => updateAnswer(q)}>수정</button>
                              </div>
                            </>
                          ) : (
                            <div className="btn-row">
                              <button 
                                className="gray-btn" 
                                onClick={() => setEditor({ id:q.questionId, text:q.answerContent || "" })}
                              >수정</button>
                              <button className="danger-btn" onClick={() => deleteAnswer(q)}>삭제</button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="paging">
          {Array.from({ length: totalPages }, (_, i) => i).map(p => (
            <button
              key={p}
              onClick={() => { setOpenId(null); setEditor({id:null,text:""}); fetchList(p); }}
              className={`page-dot ${page === p ? 'page-active' : ''}`}
            >
              {p+1}
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
