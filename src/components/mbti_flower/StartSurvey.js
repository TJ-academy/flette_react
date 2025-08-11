import { Link } from 'react-router-dom';

const StartSurvey = () => {
    return (
        <>
            <h3>나와 어울리는 꽃 찾기</h3>
            <p>
                테스트 결과에서 어울리는 꽃의 이름과<br/>
                그 꽃이 지닌 의미, 그리고 어울리는 이유를 함께 확인하실 수 있어요!<br/>
                당신의 성격을 가장 잘 표현해 줄  한 송이 꽃이 기다리고 있답니다.<br/>
            </p>
            <Link to="/survey/first">
                <button style={{width: '150px'}}>
                    시작하기
                </button>
            </Link>
        </>
    );
}
export default StartSurvey;