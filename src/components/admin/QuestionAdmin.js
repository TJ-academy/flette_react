// src/components/admin/QuestionAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function QuestionAdmin() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openId, setOpenId] = useState(null);          // 펼친 questionId
  const [editor, setEditor] = useState({ id: null, text: "" }); // 답변 작성/수정

  const fetchList = async (p = 0) => {
    try {
      const { data } = await axios.get("/api/admin/qna", { params: { page: p, size: 10 }});
      setRows(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.number || p);
    } catch (e) {
      console.error(e);
      setRows([]);
    }
  };

  useEffect(() => { fetchList(0); }, []);

  const openRow = (q) => {
    setOpenId(openId === q.questionId ? null : q.questionId);
    setEditor({ id: null, text: "" });
  };

  // 답변 작성
  const submitAnswer = async (q) => {
    if (!editor.text.trim()) return alert("내용을 입력하세요.");
    await axios.post(`/api/admin/qna/${q.questionId}/answer`, { answerContent: editor.text });
    await fetchList(page);
    setEditor({ id: null, text: "" });
  };

  // 답변 수정
  const updateAnswer = async (q) => {
    if (!editor.text.trim()) return alert("내용을 입력하세요.");
    await axios.put(`/api/admin/qna/${q.questionId}/answer/${q.answerId}`, { answerContent: editor.text });
    await fetchList(page);
    setEditor({ id: null, text: "" });
  };

  // 답변 삭제
  const deleteAnswer = async (q) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await axios.delete(`/api/admin/qna/${q.questionId}/answer/${q.answerId}`);
    await fetchList(page);
  };

  return (
    <main style={st.page}>
      <section style={st.wrap}>
        <h2 style={st.title}>Q&amp;A</h2>

        <table style={st.table}>
          <thead>
            <tr style={st.headRow}>
              <th style={st.th}>답변 상태</th>
              <th style={{...st.th, textAlign:"left"}}>제목</th>
              <th style={st.th}>작성자</th>
              <th style={st.th}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} style={st.empty}>데이터가 없습니다.</td></tr>
            ) : rows.map(q => (
              <React.Fragment key={q.questionId}>
                <tr style={st.row} onClick={() => openRow(q)}>
                  <td style={st.td}>
                    <Badge text={q.answered ? "답변 완료" : "답변 대기"} color={q.answered ? "#ff8aa0" : "#bbb"} />
                  </td>
                  <td style={{...st.td, textAlign:"left"}}>{q.title}</td>
                  <td style={st.td}>{q.useridMasked}</td>
                  <td style={st.td}>{fmt(q.questionDate)}</td>
                </tr>

                {openId === q.questionId && (
                  <tr>
                    <td colSpan={4} style={st.detailCell}>
                      {/* 질문 본문 */}
                      <div style={st.qBox}>
                        <div style={st.qTitle}>질문</div>
                        <div style={st.qText}>{q.questionContent}</div>
                      </div>

                      {/* 답변 영역 */}
                      {!q.answered ? (
                        <div style={st.editBox}>
                          <textarea
                            value={editor.id === q.questionId ? editor.text : ""}
                            onChange={(e) => setEditor({ id: q.questionId, text: e.target.value.slice(0,1000) })}
                            style={st.textarea}
                            placeholder="내용을 입력하세요."
                          />
                          <div style={st.editFoot}>
                            <span style={{ color:"#999", fontSize:12 }}>
                              {(editor.id === q.questionId ? editor.text.length : 0)}/1000
                            </span>
                            <button style={st.primaryBtn} onClick={() => submitAnswer(q)}>등록</button>
                          </div>
                        </div>
                      ) : (
                        <div style={st.aBox}>
                          <div style={st.aLabel}>답변</div>
                          <div style={st.aMeta}>판매자 · {fmt(q.answerDate)}</div>
                          <div style={st.aText}>{q.answerContent}</div>

                          {editor.id === q.questionId ? (
                            <>
                              <textarea
                                value={editor.text}
                                onChange={(e)=> setEditor({ id: q.questionId, text: e.target.value.slice(0,1000) })}
                                style={{...st.textarea, marginTop:10}}
                              />
                              <div style={st.btnRow}>
                                <button style={st.grayBtn} onClick={() => setEditor({ id:null, text:"" })}>취소</button>
                                <button style={st.primaryBtn} onClick={() => updateAnswer(q)}>수정</button>
                              </div>
                            </>
                          ) : (
                            <div style={st.btnRow}>
                              <button style={st.grayBtn} onClick={() => setEditor({ id:q.questionId, text:q.answerContent || "" })}>수정</button>
                              <button style={st.dangerBtn} onClick={() => deleteAnswer(q)}>삭제</button>
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

        {/* 페이징 */}
        <div style={st.paging}>
          {Array.from({length: totalPages}, (_,i)=>i).map(p => (
            <button
              key={p}
              onClick={() => { setPage(p); setOpenId(null); setEditor({id:null,text:""}); fetchList(p); }}
              style={{...st.pageDot, ...(page===p? st.pageActive : {})}}
            >
              {p+1}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

/* --------- small utils ---------- */
function fmt(d){ if(!d) return ""; const t=new Date(d); const y=String(t.getFullYear()).slice(2); const m=String(t.getMonth()+1).padStart(2,"0"); const da=String(t.getDate()).padStart(2,"0"); return `${y}-${m}-${da}`; }
function Badge({text,color}){ return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:999,border:`1px solid ${color}55`,background:`${color}22`,color}}>{text}</span>; }

/* --------- styles ---------- */
const st = {
  page:{ display:"grid", placeItems:"center", padding:"24px 16px", background:"#fff" },
  wrap:{ width:"min(920px, 94vw)" },
  title:{ width:160, margin:"0 auto 16px", textAlign:"center", background:"#ff88a0", color:"#fff", padding:"10px 0", borderRadius:999, fontSize:16, fontWeight:700 },

  table:{ width:"100%", borderCollapse:"collapse" },
  headRow:{ borderTop:"1px solid #f2b9c2", background:"#fff" },
  th:{ padding:"10px 8px", color:"#666", fontWeight:700, borderBottom:"1px solid #eee", fontSize:14 },
  row:{ borderBottom:"1px solid #f4f4f4", cursor:"pointer" },
  td:{ padding:"10px 8px", textAlign:"center", fontSize:14 },
  empty:{ padding:"28px 8px", textAlign:"center", color:"#999" },

  detailCell:{ padding:16, background:"#fff" },
  qBox:{ background:"#f7f7f7", border:"1px solid #eee", borderRadius:8, padding:14 },
  qTitle:{ fontWeight:700, marginBottom:6 },
  qText:{ whiteSpace:"pre-wrap", color:"#444", lineHeight:1.6 },

  editBox:{ marginTop:10, background:"#fff", border:"1px solid #eee", borderRadius:8, padding:12 },
  textarea:{ width:"100%", height:140, border:"1px solid #ddd", borderRadius:8, padding:"10px 12px", outline:"none", resize:"vertical" },
  editFoot:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 },

  aBox:{ marginTop:12, background:"#f7f7f9", border:"1px solid #eee", borderRadius:8, padding:14 },
  aLabel:{ display:"inline-block", padding:"2px 8px", borderRadius:6, background:"#333", color:"#fff", fontSize:12, marginBottom:6 },
  aMeta:{ fontSize:12, color:"#777", marginBottom:6 },
  aText:{ whiteSpace:"pre-wrap", color:"#333", lineHeight:1.6 },

  btnRow:{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:10 },
  primaryBtn:{ padding:"8px 14px", borderRadius:999, border:"none", background:"#ff88a0", color:"#fff", cursor:"pointer", fontWeight:700 },
  grayBtn:{ padding:"8px 14px", borderRadius:999, border:"none", background:"#f2f2f2", color:"#333", cursor:"pointer" },
  dangerBtn:{ padding:"8px 14px", borderRadius:999, border:"none", background:"#ff6b6b", color:"#fff", cursor:"pointer" },

  paging:{ textAlign:"center", marginTop:16, color:"#aaa" },
  pageDot:{ border:"none", background:"transparent", cursor:"pointer", padding:"4px 8px", borderRadius:6 },
  pageActive:{ color:"#ff7f93", fontWeight:700 }
};
