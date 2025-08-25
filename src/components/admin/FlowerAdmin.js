import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/admin.css";

export default function FlowerAdmin() {
  const [flowers, setFlowers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
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
    story: "",
    show: true,
    file: null,
  });

  const loadFlowers = async (toPage = 0) => {
    try {
      const params = { page: toPage, size };
      if (q.trim()) params.q = q.trim();
      if (category) params.category = category;
      if (show !== "") params.show = show === "true";

      const res = await axios.get("/api/admin/flowers", { params });
      setFlowers(res.data.content || []);
      setCurrentPage(res.data.number || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("꽃 목록 로딩 실패", e);
      setFlowers([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    // q, category, show가 변경되면 0페이지부터 다시 로드
    loadFlowers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, show]);

  // page 상태가 변경되었을 때만 데이터를 로드하는 별도의 useEffect
  useEffect(() => {
    loadFlowers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const save = async () => {
    const formData = new FormData();
    formData.append("flowerName", form.flowerName);
    formData.append("category", form.category);
    formData.append("addPrice", form.addPrice);
    formData.append("description", form.description);
    formData.append("story", form.story);
    formData.append("show", form.show);
    if (form.file) formData.append("file", form.file);

    try {
      if (editingId == null) {
        await axios.post("/api/admin/flowers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put(`/api/admin/flowers/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      loadFlowers(0);
    } catch (e) {
      console.error("저장 실패", e);
      alert("저장에 실패했습니다.");
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      addPrice: 0,
      category: "",
      description: "",
      flowerName: "",
      story: "",
      show: true,
      file: null,
    });
    setModalOpen(true);
  };

  const openEdit = (flower) => {
    setEditingId(flower.flowerId);
    setForm({
      addPrice: flower.addPrice,
      category: flower.category,
      description: flower.description,
      flowerName: flower.flowerName,
      story: flower.story,
      show: flower.show,
      file: null,
    });
    setModalOpen(true);
  };

  const deleteFlower = async (flowerId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/admin/flowers/${flowerId}`);
      loadFlowers(0);
    } catch (e) {
      console.error("삭제 실패", e);
      alert("삭제에 실패했습니다.");
    }
  };

  const toggleShow = async (flower) => {
    try {
      await axios.patch(`/api/admin/flowers/${flower.flowerId}/show`, {
        show: !flower.show,
      });
      loadFlowers(0);
    } catch (e) {
      console.error("노출 상태 변경 실패", e);
      alert("노출 상태 변경에 실패했습니다.");
    }
  };

  return (
    <div className="page">
      <div className="wrap">
        <div className="title">꽃 관리</div>

        {/* 상단 필터 */}
        <div className="unanswered-toggle">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="oBtn"
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
            className="oBtn"
            style={{ padding: "6px 10px" }}
          >
            <option value="">전체 노출</option>
            <option value="true">노출</option>
            <option value="false">숨김</option>
          </select>

          <button className="oBtn" onClick={openAdd}>
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
                      <button
                        className={f.show ? "gray-btn" : "danger-btn"}
                        onClick={() => toggleShow(f)}
                      >
                        {f.show ? "노출중" : "숨김"}
                      </button>
                    </td>
                    <td className="td">
                      <button className="oBtn" onClick={() => openEdit(f)}>
                        수정
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => deleteFlower(f.flowerId)}
                      >
                        삭제
                      </button>
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

          {/* 페이징 UI */}
          <div className="paging">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="pagination-btn"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`pagination-btn ${currentPage === i ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="pagination-btn"
            >
              &gt;
            </button>
          </div>
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
                />

                <div className="label">카테고리</div>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="textarea"
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
                />

                <div className="label">이미지 파일</div>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={onChange}
                  className="textarea"
                />

                <div className="label">설명</div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="textarea"
                />

                <div className="label">스토리</div>
                <textarea
                  name="story"
                  value={form.story}
                  onChange={onChange}
                  className="textarea"
                />

                <div className="label">노출</div>
                <label>
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
              <button className="pBtn" onClick={save}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
