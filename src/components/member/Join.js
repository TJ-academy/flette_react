// Join.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/member/join.css';

function Join() {
  const [userid, setUserid] = useState('');
  const [passwd, setPasswd] = useState('');
  const [confirmPasswd, setConfirmPasswd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 비밀번호 일치 여부 확인
  useEffect(() => {
    if (passwd && confirmPasswd) {
      if (passwd !== confirmPasswd) {
        setErrorMsg('비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMsg('');
      }
    } else {
      setErrorMsg('');
    }
  }, [passwd, confirmPasswd]);

  const checkIdDuplicate = () => {
    if (!userid.trim()) {
      setIdCheckMsg('아이디를 입력해주세요.');
      setIsIdChecked(false);
      return;
    }

    fetch(`https://sure-dyane-flette-f3f77cc0.koyeb.app/api/member/exist?userid=${encodeURIComponent(userid)}`)
      .then(response => response.text())
      .then(result => {
        if (result === 'false') {
          setIdCheckMsg('사용할 수 있는 아이디입니다.');
          setIsIdChecked(true);
        } else {
          setIdCheckMsg('이미 사용 중인 아이디입니다.');
          setIsIdChecked(false); //수정해야 됨
        }
      })
      .catch(() => {
        setIdCheckMsg('서버 오류. 다시 시도해주세요.');
        setIsIdChecked(false);
      });
  };

  const navigate = useNavigate();

  // 다음 페이지로 이동하는 함수
  const handleNext = () => {
    // 다음 버튼 클릭 시 유효성 검사
    if (isIdChecked && passwd && passwd === confirmPasswd) {
      // JoinNext 페이지로 아이디와 비밀번호 상태를 전달하며 이동
      navigate('/member/joinNext', { 
        state: { 
          userid, 
          passwd 
        } 
      });
    } else if (!isIdChecked) {
      setIdCheckMsg('아이디 중복 확인이 필요합니다.');
    } else if (!passwd || passwd !== confirmPasswd) {
      setErrorMsg('비밀번호를 확인해주세요.');
    }
  };

  return (
    <div>
      <div className="join_box">
        <p className="join_text">회원가입</p>
        <div className="join_container">
          {/* form 태그 제거, 또는 onSubmit 이벤트 제거 */}
            <label className="joinLabel">아이디를 입력하세요.</label>
            <div className="input-group-one" style={{ margin: 0}}>
              <input
                type="text"
                value={userid}
                onChange={(e) => {
                  setUserid(e.target.value);
                  setIdCheckMsg('');
                  setIsIdChecked(false);
                }}
                className="inputClass-one"
              />
              <button
                type="button"
                onClick={checkIdDuplicate}
                className="dupliBtn-one"
              >
                중복체크
              </button>
            </div>
            <span className="error" style={{ marginBottom: 10}}>{idCheckMsg}</span>

            <label className="joinLabel">비밀번호를 입력하세요.</label>
            <div className="input-group-one">
              <input
                type="password"
                value={passwd}
                onChange={(e) => setPasswd(e.target.value)}
                className="inputClass-one"
              />
            </div>
            <label className="joinLabel">비밀번호를 다시 입력하세요.</label>
            <div className="input-group-one" style={{ margin: 0}}>
              <input
                type="password"
                value={confirmPasswd}
                onChange={(e) => setConfirmPasswd(e.target.value)}
                className="inputClass-one"
              />
            </div>
            <p className="error">{errorMsg}</p>
            <p className="text1">아이디와 비밀번호는 영문/숫자로 이루어져야 합니다.</p>
            <button
              type="button"
              id="submitBtn"
              onClick={handleNext}
              disabled={!isIdChecked || !passwd || passwd !== confirmPasswd}
            >
              다음으로
            </button>
        </div>
      </div>
    </div>
  );
}

export default Join;