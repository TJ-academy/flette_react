import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/member/login.css';

// Receive handleLogin function as a prop
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
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    })
    .then((data) => {
      // Correctly store user data in sessionStorage
      sessionStorage.setItem('loginId', data.userid);
      sessionStorage.setItem('loginName', data.username);
      
      // Call the handleLogin prop to update the state in App.js
      handleLogin(data.username);

      setErrorMsg('');
      
      // Redirect to the home page
      navigate('/');
    })
    .catch((err) => {
      setErrorMsg(err.message);
    });
  };

  return (
    <div>
      <div className="login_box">
        <p className="login_text">로그인</p>
        <div className="login_container">
          <form onSubmit={(e) => { e.preventDefault(); logincheck(); }}>
            <label htmlFor="userid" class="loginLabel">아이디를 입력하세요.</label>
            <input
              type="text"
              id="userid"
              name="userid" // name 속성을 'userid'로 수정
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              class="inputClass"
            />

            <label htmlFor="passwd" class="loginLabel">비밀번호를 입력하세요.</label>
            <input
              type="password"
              id="passwd"
              name="passwd" // name 속성을 'passwd'로 수정
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              class="inputClass"
              autoComplete="current-password"
            />

            <button type="submit" class="btnLogin">로그인</button>

            {errorMsg && <div className="message error">{errorMsg}</div>}

            <div className="signup-link" onClick={() => navigate('/member/join')}>회원가입</div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;