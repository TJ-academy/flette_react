import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userId, setUserId] = useState('');
  const [passwd, setPasswd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();  // useHistory를 useNavigate로 변경

  const logincheck = () => {
    if (userId === '') {
      alert('아이디를 입력하세요.');
      return;
    }
    if (passwd === '') {
      alert('비밀번호를 입력하세요.');
      return;
    }

    // 서버에 로그인 정보 보내기 (예: fetch나 axios로 로그인 처리)
    fetch('/login_check.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        user_id: userId,
        passwd: passwd,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'error') {
          setErrorMsg('아이디 또는 비밀번호가 일치하지 않습니다.');
        } else if (data.message === 'logout') {
          setErrorMsg('로그아웃되었습니다.');
        } else {
          setErrorMsg('');
          navigate('/dashboard'); // 로그인 후 대시보드로 리다이렉트
        }
      })
      .catch((err) => {
        setErrorMsg('서버 오류. 다시 시도해주세요.');
      });
  };

  return (
    <div>
      <p className="login_text">로그인</p>
      <div className="login_box">
        <div className="login_container">
          <form onSubmit={(e) => { e.preventDefault(); logincheck(); }}>
            <label htmlFor="userid">아이디를 입력하세요.</label>
            <input
              type="text"
              id="userid"
              name="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
            />

            <label htmlFor="passwd">비밀번호를 입력하세요.</label>
            <input
              type="password"
              id="passwd"
              name="passwd"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              autoComplete="current-password"
            />

            <button type="submit">로그인</button>

            {errorMsg && <div className="message error">{errorMsg}</div>}

            <div className="signup-link" onClick={() => navigate('/member/join')}>회원가입</div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
