import React from "react";

// 날짜 포맷 함수
export function fmt(d){ 
  if(!d) return ""; 
  const t = new Date(d); 
  const y = String(t.getFullYear()).slice(2); 
  const m = String(t.getMonth() + 1).padStart(2, "0"); 
  const da = String(t.getDate()).padStart(2, "0"); 
  return `${y}-${m}-${da}`; 
}

// 답변 상태를 표시하는 뱃지 컴포넌트
export function Badge({ text, color }) { 
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:999,border:`1px solid ${color}55`,background:`${color}22`,color}}>{text}</span>; 
}
