import React from 'react';
import { useNavigate } from 'react-router-dom';

function JoinFinish() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        backgroundColor: '#F7EAD9',
        margin: 0,
        fontFamily: "'Noto Sans KR', sans-serif",
        color: '#6B4F3B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // 가로 가운데 정렬
      }}
    >
      <div style={{ marginBottom: '134px' }}></div>
      <img src="../../resources/images/suho.PNG" alt="Suho" />
      <br />
      <p
        style={{
          color: '#9C6B4F',
          fontWeight: 'bold',
          fontSize: '32px',
        }}
      >
        환영합니다!
      </p>
      <p
        style={{
          fontSize: '19px',
          color: '#2E2E2E',
          textAlign: 'center',
        }}
      >
        마을의 새로운 수호자님.
        <br />
        사라지는 설화를 지키는 여정에 함께 해주셔서 감사합니다.
      </p>
      <br />
      <br />
      <button
        type="button"
        className="login_btn"
        style={{
          width: '146px',
          height: '57px',
          background: '#9C6B4F',
          color: 'white',
          borderRadius: '20px',
          border: 'none',
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#733512'; // Hover effect
        }}
        onMouseOut={(e) => {
          e.target.style.background = '#9C6B4F'; // Revert hover effect
        }}
        onClick={handleLoginClick}
      >
        로그인
      </button>
    </div>
  );
}

export default JoinFinish;
