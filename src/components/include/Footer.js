import React from 'react';
import '../../css/footer.css'; // footer.css 파일을 import

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">© 2025 palette. All rights reserved.</p>
                <p className="footer-text">당신의 하루에 향기를 더하는 맞춤형 꽃 플랫폼</p>
                <div className="footer-info">
                    <span className="footer-item">고객센터 1234-5678</span>
                    <span className="footer-item">운영시간 월~금 09:00~18:00 (주말·공휴일 휴무)</span>
                    <span className="footer-item">이메일: palette@gmail.com</span>
                    <span className="footer-item">Team palette | 주소: 서울 종로구 우정국로 21 9층</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
