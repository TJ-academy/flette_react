import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/admin.css"; // 경로 확인

export default function FlowerAdmin() {
  const [flowers, setFlowers] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 검색 필터
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [show, setShow] = useState(""); // "", "true", "false"

  // 모달 & 폼
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    addPrice: 0,
    category: "",
    description: "",
    flowerName: "",
    imageName: "",
    story: "",
    show: true,
  });

  const loadFlowers = async (toPage = page) => {
    try {
      const params = { page: toPage, size };
      if (q.trim()) params.q = q.trim();
      if (category) params.category = category;
      if (show !== "") params.show = show === "true";

      const res = await axios.get("/api/admin/flowers", { params });
      setFlowers(res.data.content || []);
      setPage(res.data.number || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("꽃 목록 로딩 실패", e);
      setFlowers([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    loadFlowers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, show]);

  // 전시여부 토글
  const toggleShow = async (f) => {
    try {
      await axios.patch(`/api/admin/flowers/${f.flowerId}/show`, {
        show: !f.show,
      });
      loadFlowers();
    } catch (e) {
      console.error("전시여부 변경 실패", e);
    }
  };

  // 삭제
  const remove = async (id) => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    try {
      await axios.delete(`/api/admin/flowers/${id}`);
      loadFlowers();
    } catch (e) {
      console.error("삭제 실패", e);
    }
  };

  // 모달 열기 - 새 꽃
  const openAdd = () => {
    setEditingId(null);
    setForm({
      addPrice: 0,
      category: "",
      description: "",
      flowerName: "",
      imageName: "",
      story: "",
      show: true,
    });
    setModalOpen(true);
  };

  // 모달 열기 - 수정
  const openEdit = (f) => {
    setEditingId(f.flowerId);
    setForm({
      addPrice: f.addPrice ?? 0,
      category: f.category ?? "",
      description: f.description ?? "",
      flowerName: f.flowerName ?? "",
      imageName: f.imageName ?? "",
      story: f.story ?? "",
      show: !!f.show,
    });
    setModalOpen(true);
  };

  // 저장(추가/수정)
  const save = async () => {
    try {
      if (!form.flowerName.trim()) {
        alert("꽃 이름을 입력하세요.");
        return;
      }
      if (editingId == null) {
        // create
        await axios.post("/api/admin/flowers", {
          ...form,
          addPrice: Number(form.addPrice) || 0,
        });
      } else {
        // update (부분 갱신도 가능하지만 여기선 전체 바인딩)
        await axios.put(`/api/admin/flowers/${editingId}`, {
          ...form,
          addPrice: Number(form.addPrice) || 0,
        });
      }
      setModalOpen(false);
      loadFlowers();
    } catch (e) {
      console.error("저장 실패", e);
      alert("저장에 실패했습니다.");
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="page">
      <div className="wrap">
        <div className="title">관리자 꽃</div>

        {/* 상단 필터 */}
        <div className="unanswered-toggle">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-btn"
            style={{ padding: "6px 10px" }}
          >
            <option value="">전체 카테고리</option>
            <option value="메인">메인</option>
            <option value="서브">서브</option>
            <option value="잎사귀">잎사귀</option>
          </select>

          <select
            value={show}
            onChange={(e) => setShow(e.target.value)}
            className="outline-btn"
            style={{ padding: "6px 10px" }}
          >
            <option value="">전체 노출</option>
            <option value="true">노출</option>
            <option value="false">비노출</option>
          </select>

          <input
            placeholder="이름/설명/스토리 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="textarea"
            style={{ height: 36, maxWidth: 240 }}
          />

          <button className="primary-btn" onClick={() => loadFlowers(0)}>
            검색
          </button>

          <button className="outline-btn" onClick={openAdd}>
            새 꽃 추가
          </button>
        </div>

        {/* 테이블 */}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="th">ID</th>
                <th className="th">카테고리</th>
                <th className="th">이름</th>
                <th className="th">추가금액</th>
                <th className="th">이미지</th>
                <th className="th">노출</th>
                <th className="th">관리</th>
              </tr>
            </thead>
            <tbody>
              {flowers.length ? (
                flowers.map((f) => (
                  <tr className="row" key={f.flowerId}>
                    <td className="td">{f.flowerId}</td>
                    <td className="td">{f.category}</td>
                    <td className="td text-left">{f.flowerName}</td>
                    <td className="td">
                      {(f.addPrice ?? 0).toLocaleString()}원
                    </td>
                    <td className="td">{f.imageName || "-"}</td>
                    <td className="td">
                      <button className="gray-btn" onClick={() => toggleShow(f)}>
                        {f.show ? "노출중" : "비노출"}
                      </button>
                    </td>
                    <td className="td">
                      <div className="btn-row" style={{ justifyContent: "center", marginTop: 0 }}>
                        <button className="outline-btn" onClick={() => openEdit(f)}>
                          수정
                        </button>
                        <button className="danger-btn" onClick={() => remove(f.flowerId)}>
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan={7}>
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="paging">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-dot ${i === page ? "page-active" : ""}`}
              onClick={() => {
                setPage(i);
                loadFlowers(i);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {editingId == null ? "새 꽃 추가" : `꽃 수정 #${editingId}`}
            </div>
            <div className="modal-message">
              <div className="detail-row">
                <div className="label">이름</div>
                <input
                  name="flowerName"
                  value={form.flowerName}
                  onChange={onChange}
                  className="textarea"
                  style={{ height: 36 }}
                />

                <div className="label">카테고리</div>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="textarea"
                  style={{ height: 36 }}
                >
                  <option value="">선택</option>
                  <option value="메인">메인</option>
                  <option value="서브">서브</option>
                  <option value="잎사귀">잎사귀</option>
                </select>

                <div className="label">추가금액</div>
                <input
                  type="number"
                  name="addPrice"
                  value={form.addPrice}
                  onChange={onChange}
                  className="textarea"
                  style={{ height: 36 }}
                />

                <div className="label">이미지명</div>
                <input
                  name="imageName"
                  value={form.imageName}
                  onChange={onChange}
                  className="textarea"
                  style={{ height: 36 }}
                  placeholder="예: 장미.png"
                />

                <div className="label">설명</div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="textarea"
                  placeholder="설명을 입력하세요"
                />

                <div className="label">스토리</div>
                <textarea
                  name="story"
                  value={form.story}
                  onChange={onChange}
                  className="textarea"
                  placeholder="스토리를 입력하세요"
                />

                <div className="label">노출</div>
                <label style={{ alignSelf: "center" }}>
                  <input
                    type="checkbox"
                    name="show"
                    checked={!!form.show}
                    onChange={onChange}
                  />{" "}
                  노출
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button className="gray-btn" onClick={() => setModalOpen(false)}>
                취소
              </button>
              <button className="primary-btn" onClick={save}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
