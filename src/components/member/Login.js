import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/member/login.css';

// handleLogin 함수를 props로 받습니다.
function Login({ handleLogin }) {
  const [userId, setUserId] = useState('');
  const [passwd, setPasswd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const logincheck = () => {
    if (userId === '') {
      alert('아이디를 입력하세요.');
      return;
    }
    if (passwd === '') {
      alert('비밀번호를 입력하세요.');
      return;
    }

    fetch('/api/member/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        passwd: passwd,
      }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // 서버에서 아이디 또는 비밀번호 불일치 시 에러 메시지를 보냅니다.
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    })
    .then((data) => {
      // 서버 응답(data)에는 'userid', 'username', 'level' 등의 정보가 포함되어 있습니다.
      // sessionStorage에 사용자 데이터를 저장합니다.
      sessionStorage.setItem('loginId', data.userid);
      sessionStorage.setItem('loginName', data.username);
      sessionStorage.setItem('userLevel', data.level); // 레벨 정보도 추가로 저장합니다.
      
      // App.js에서 받은 handleLogin 함수를 호출하여 상태를 업데이트합니다.
      // 이때 username과 level 정보를 함께 전달합니다.
      handleLogin(data.username, data.level);

      setErrorMsg('');
      
      // 로그인 성공 후 홈페이지로 이동합니다.
      navigate('/');
    })
    .catch((err) => {
      setErrorMsg(err.message);
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
              name="userid"
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