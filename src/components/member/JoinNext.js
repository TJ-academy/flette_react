// JoinNext.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function JoinNext() {
  // Join 페이지에서 전달받은 상태를 가져옵니다.
  const location = useLocation();
  const { userid, passwd } = location.state || {}; 

  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // 폼 유효성 검사 로직을 useEffect에 통합
  useEffect(() => {
    // 모든 필수 필드(name, address1, address2)가 채워졌는지 확인
    // name, address1, address2 모두 비어있지 않아야 true가 됨
    if (name && address1 && address2) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, address1, address2]); // name, address1, address2 상태가 변경될 때마다 실행

  const handlePostcodeSearch = () => {
    // 다음 우편번호 찾기 스크립트가 로드되어 있는지 확인
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          if (data.userSelectedType === 'R' && data.bname) {
            addr += ` (${data.bname})`;
          }
          setAddress1(`(${data.zonecode}) ${addr}`);
          setAddress2('');
        }
      }).open();
    } else {
      console.error("다음 우편번호 찾기 스크립트가 로드되지 않았습니다.");
    }
  };

  // 폼 최종 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 최종 유효성 검사
    if (!isFormValid) {
        console.error("필수 정보를 모두 입력해주세요.");
        return; 
    }

    // 모든 데이터를 통합하여 하나의 객체로 만듭니다.
    const formData = {
      userid: userid, // Join 페이지에서 받은 아이디
      passwd: passwd, // Join 페이지에서 받은 비밀번호
      name: name,
      address1: address1,
      address2: address2,
    };
    
    console.log("최종 제출 데이터:", formData);

    // TODO: 백엔드 API로 데이터 전송
    fetch('/api/member/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) {
        console.log('회원가입 성공!');
        navigate('/member/joinFinish');
      } else {
        console.error('회원가입 실패!');
      }
    })
    .catch(error => {
      console.error('네트워크 오류:', error);
    });
  };

  return (
    <div>
      <p className="join_text">회원가입</p>
      <div className="join_box">
        <div className="join_container d-flex justify-content-center">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="userid" value={userid} />
            <input type="hidden" name="passwd" value={passwd} />

            <label>이름</label>
            <div className="input-group">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '337px' }}
                required
              />
            </div>

            <label>주소</label>
            <div className="input-group">
              <input
                type="text"
                name="address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                style={{ width: '337px' }}
                required
                readOnly
              />
              <button type="button" onClick={handlePostcodeSearch} className="search_btn" style={{ borderRadius: '0 15px 15px 0' }}>
                우편번호 검색
              </button>
              <br />
              <input
                type="text"
                name="address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="상세 주소를 입력하세요."
                style={{ width: '337px', borderRadius: '10px' }}
                required
              />
            </div>

            <br />
            <br />
            <button type="submit" id="submitBtn" disabled={!isFormValid}>
              저장하기 ✔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinNext;