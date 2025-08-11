// JoinNext.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/member/joinNext.css';

function JoinNext() {
  const location = useLocation();
  const { userid, passwd } = location.state || {}; 

  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [tel, setTel] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // 폼 유효성 검사 로직
  useEffect(() => {
    // 모든 필수 필드(name, address1, address2, tel)가 채워졌는지 확인
    if (name && address1 && address2 && tel) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, address1, address2, tel]);

  const handlePostcodeSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          if (data.userSelectedType === 'R' && data.bname) {
            addr += ` (${data.bname})`;
          }
          setZipcode(data.zonecode);
          setAddress1(`${addr}`);
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
    
    if (!isFormValid) {
      console.error("필수 정보를 모두 입력해주세요.");
      return; 
    }

    const formData = {
      userid: userid, 
      passwd: passwd, 
      username: name,
      zipcode: zipcode,
      address1: address1, 
      address2: address2,
      tel: tel,
    };
    
    console.log("최종 제출 데이터:", formData);

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
      <div className="join_box">
        <p className="join_text">회원가입</p>
        <div className="join_container d-flex justify-content-center">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="userid" value={userid} />
            <input type="hidden" name="passwd" value={passwd} />

            <label className='labelNext'>이름</label>
            <div className="input-group2">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '337px' }}
                required
                className='inputStyle2'
              />
            </div>

            <label className='labelNext'>주소</label>
            <div className="input-group2">
              <input
                type="text"
                name="zipcode"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                style={{ width: '150px' }}
                required
                readOnly
                className='inputStyle2'
              />
              <button type="button" onClick={handlePostcodeSearch} className="search_btn2" style={{ borderRadius: '0 15px 15px 0' }}>
                우편번호 검색
              </button>
              <br />
              <input
                type="text"
                name="address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="주소를 입력하세요."
                style={{ width: '337px', borderRadius: '10px' }}
                required
                readOnly
                className='inputStyle2'
              />
              <input
                type="text"
                name="address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="상세 주소를 입력하세요."
                style={{ width: '337px', borderRadius: '10px' }}
                required
                className='inputStyle2'
              />
            </div>
            
            <label className='labelNext'>전화번호</label>
            <div className="input-group2">
              <input
                type="text"
                name="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="ex) 010-1234-5678"
                style={{ width: '337px', borderRadius: '10px' }}
                required
                className='inputStyle2'
              />
            </div>

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