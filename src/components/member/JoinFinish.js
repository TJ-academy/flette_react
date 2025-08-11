import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/member/joinfinish.css'; // CSS 파일 경로 추가

function JoinFinish() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="join-finish-container">
      <p className="join-finish-title">회원가입이 완료되었어요! 🌷</p>

      <p className="join-finish-message">
        이제 당신만의 감정, 성격, 취향을 담은 꽃다발을 만나볼 수 있어요. <br />
        꽃처럼 피어나는 당신의 이야기를 함께 만들어 볼게요. <br />
        지금부터 Flette와 함께, 나만의 꽃을 시작해 보세요.
      </p>

      <button
        type="button"
        className="join-finish-button"
        onClick={() => navigate('/')} // 메인 페이지('/')로 이동하도록 수정
      >
        메인으로
      </button>
    </div>
  );
}

export default JoinFinish;
