// src/components/admin/MainAdmin.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/admin/admin.css';

function StatCard({ title, value }) {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #eee', 
      display: 'grid',
      gap: '6px',
      background: '#fff',
      textAlign: 'center'
    }}>
      <strong style={{ fontSize: '14px', color: '#666' }}>{title}</strong>
      <span style={{ fontSize: '24px', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function MainAdmin() {
  const [stats, setStats] = useState({
    todayMembers: 0,
    todayReviews: 0,
    todayOrders: 0,
    unansweredQuestions: 0,
    totalMembers: 0,
    totalReviews: 0,
    totalOrders: 0,
    totalQuestions: 0
  });

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('대시보드 데이터 불러오기 실패:', err));
  }, []);

  return (
    <div style={{ padding: '80px' }}>
      <br></br>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>관리자 대시보드</h1>
      <br></br>
      <br></br>
      {/* 빠른 링크 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <Link to="/admin/member" className="admin-link-btn">회원 관리</Link>
        <Link to="/admin/flower" className="admin-link-btn">꽃 관리</Link>
        <Link to="/admin/order" className="admin-link-btn">주문 관리</Link>
        <Link to="/admin/question" className="admin-link-btn">문의 관리</Link>
      </div>
      <br></br>
      {/* 오늘 기준 지표 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard title="오늘 가입 회원" value={`${stats.todayMembers} 명`} />
        <StatCard title="오늘 리뷰 건수" value={`${stats.todayReviews} 건`} />
        <StatCard title="오늘 주문 건수" value={`${stats.todayOrders} 건`} />
        <StatCard title="미답변 문의" value={`${stats.unansweredQuestions} 건`} />
      </div>

      {/* 총 기준 지표 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        <StatCard title="총 회원 수" value={`${stats.totalMembers} 명`} />
        <StatCard title="총 리뷰 건수" value={`${stats.totalReviews} 건`} />
        <StatCard title="총 주문 건수" value={`${stats.totalOrders} 건`} />
        <StatCard title="총 문의 건수" value={`${stats.totalQuestions} 건`} />
      </div>
      <br></br><br></br>
    </div>
    
  );
}

const btnStyle = {
  padding: '14px 16px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  textDecoration: 'none',
  color: '#111',
  background: '#fff',
  textAlign: 'center'
};
