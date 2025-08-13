import { Link } from 'react-router-dom';
import '../../css/test/StartSurvey.css';

const StartSurvey = () => {
    return (
        <div className="survey-start-container">
            
            <div className="survey-card">
                <h2 className="survey-title">나와 어울리는 꽃 찾기</h2>
                <img
                    src="/img/test_info.png"
                    alt="나와 어울리는 꽃 찾기"
                    className="survey-image"
                />
                <p className="survey-description">
                    테스트 결과에서 어울리는 꽃의 이름과<br />
                    그 꽃이 지닌 의미, 그리고 어울리는 이유를 함께 확인하실 수 있어요!<br />
                    당신의 성격을 가장 잘 표현해 줄 한 송이 꽃이 기다리고 있답니다.
                </p>
                <Link to="/survey/first">
                    <button className="start-button">
                        시작하기
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default StartSurvey;
