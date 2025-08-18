import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../css/test/FirstSurvey.css';


import gukhwa from "./img/국화.png";
import delpi from "./img/델피늄.png";
import mulmang from "./img/물망초.png";
import backhap from "./img/백합.png";
import cane from "./img/분홍카네이션.png";
import rose from "./img/붉은장미.png";
import edel from "./img/에델바이스.png";
import cosmos from "./img/코스모스.png";
import tulrip from "./img/튤립.png";
import iris from "./img/푸른아이리스.png";
import prizia from "./img/프리지아.png";
import sunbaragi from "./img/해바라기.png";
import hiasins from "./img/히아신스.png";
import suguk from "./img/수국.png";
import jakyak from "./img/작약.png";

const questions = [
    { id: 1, text: "혼자 있는 시간이 당신에겐?", options: ["꼭 필요하고 편안하다", "사람들과 어울리는 게 더 좋다"] },
    { id: 2, text: "만약 당신이 무인도에 떨어진다면?", options: ["그럴 일이 없다", "어떻게 생존할 지 미리 상상해본다"] },
    { id: 3, text: "나 시험 잘 못 본 것 같아서 속상해", options: ["몇 점인데?", "괜찮아? ㅠㅠ.."] },
    { id: 4, text: "계획이 틀어졌을 때 당신은?", options: ["계획이 어긋난 것이 답답하고 화가 난다", "그럴 수 있지~ 하고 넘긴다"] },
    { id: 5, text: "친구들과의 모임에서 나는", options: ["소수의 가까운 사람들과 깊게 이야기 하는 걸 좋아한다", "다양한 사람과 두루두루 이야기하는 걸 좋아한다"] },
    { id: 6, text: "결정을 내릴 때", options: ["객관적인 사실과 데이터를 기반으로 한다", "내 느낌과 직감을 믿는다"] },
    { id: 7, text: "내 감정을 표현할 때", options: ["솔직하게 드러내는 편이다", "감정을 잘 드러내지 않고 속으로 정리하는 편이다"] },
    { id: 8, text: "일상에서 규칙이나 절차를 따르는 걸", options: ["중요하게 생각한다", "너무 엄격하면 답답하다"] },
    { id: 9, text: "물건을 샀을 때 나는", options: ["먼저 설명서를 꼼꼼히 읽어본다", "감대로 일단 작동해본다"] },
    { id: 10, text: "2주일 만에 쉬는 날이 생겼다. 당신은?", options: ["무음 모드 ON, 집에서 휴식을 취한다", "당장 약속 잡아!"] },
    { id: 11, text: "내가 더 선호하는 파트너는?", options: ["일은 잘하는데, 싸가지 없고 사회성 떨어지는 파트너", "일은 못하지만, 다정하고 사회성이 좋은 파트너"] },
    { id: 12, text: "나에게 더 맞는 여행은?", options: ["계획대로 잘 짜여진 여행", "자유롭게 즉흥적으로 하는 여행"] }
];


const mbtiResults = {
  ISTJ: {
    flowerId: 1, // 국화
    flower: "국화",
    image: gukhwa,
    description:
      "늘 책임감 있게 묵묵히 자리를 지키는 당신. 누군가는 놓치는 부분까지 꼼꼼하게 챙기며, 말보다 행동으로 신뢰를 쌓는 사람. 당신의 성실함은 조용히 피어도 한결같은 국화처럼 든든하고 깊습니다.",
    flowerMeaning: "진실, 성실, 고결함",
  },
  ISFJ: {
    flowerId: 9, // 델피늄
    flower: "델피늄",
    image: delpi,
    description:
      "늘 타인의 마음을 먼저 살피고, 누군가의 하루가 조금 더 따뜻해지길 바라는 당신. 큰 소리 내지 않아도 당신의 다정함은 주변을 천천히 변화시키는 힘이 있어요. 그 조용한 헌신과 배려의 마음, 델피늄이 꼭 닮았습니다.",
    flowerMeaning: "당신을 행복하게 해 줄게요",
  },
  INFJ: {
    flowerId: 2, // 푸른아이리스
    flower: "푸른 아이리스",
    image: iris,
    description:
      "언제나 한 걸음 앞서 생각하며, 묵묵히 자신의 길을 걷는 당신. 타인의 시선보다 내면의 목표에 집중할 줄 아는 의지와 냉철함. 차가워 보여도 속은 뜨거운, 푸른 아이리스가 당신과 닮았습니다.",
    flowerMeaning: "좋은 소식, 지혜, 믿음",
  },
  ISTP: {
    flowerId: 3, // 에델바이스
    flower: "에델바이스",
    image: edel,
    description:
      "쓸데없는 말은 줄이고, 행동으로 보여주는 당신. 문제를 보면 먼저 움직이고, 조용히 해결해내는 그 손길. 심플하지만 강한 생명력을 가진 에델바이스처럼 단단한 사람입니다.",
    flowerMeaning: "소중한 추억",
  },
  ISFP: {
    flowerId: 4, // 수국
    flower: "수국",
    image: suguk,
    description:
      "작은 순간에도 아름다움을 느끼는 당신. 말보다는 느낌, 구조보다는 감성에 더 귀를 기울이는 섬세한 마음. 자연스럽고 수수하게 피어나는 수국처럼 조용히 사람을 끌어당깁니다.",
    flowerMeaning: "진심, 변덕, 냉정",
  },
  INFP: {
    flowerId: 10, // 물망초
    flower: "물망초",
    image: mulmang,
    description:
      "세상이 조금 더 따뜻했으면 하는 바람을 마음속에 품은 당신. 상처 입은 마음도 끌어안는 당신의 감성은 위로가 됩니다. 조용하지만 누구보다 깊은 마음, 당신은 물망초처럼 오래 기억돼요.",
    flowerMeaning: "나를 잊지 말아요",
  },
  INTP: {
    flowerId: 12, // 히아신스
    flower: "히아신스",
    image: hiasins,
    description:
      "끝없이 생각하고, 질문하고, 구조를 파악하는 당신. 세상의 이치를 탐구하며 자신만의 세계를 만들어가는 사람. 냉정해 보여도 깊은 호기심을 품은 당신은 히아신스처럼 신비롭습니다.",
    flowerMeaning: "슬픔, 겸손, 사랑",
  },
  ESTP: {
    flowerId: 5, // 해바라기
    flower: "해바라기",
    image: sunbaragi,
    description:
      "지금 이 순간을 가장 빛나게 만드는 당신. 주저하지 않고 움직이며, 생동감 넘치는 에너지로 주변을 밝히는 존재. 해바라기처럼 존재 자체가 활력인 사람입니다.",
    flowerMeaning: "숭배, 기다림, 동경",
  },
  ESFP: {
    flowerId: 11, // 프리지아
    flower: "프리지아",
    image: prizia,
    description:
      "사람들과 함께하는 걸 사랑하고, 즐거움을 나누는 당신. 주변 사람들의 웃음을 볼 때 가장 행복한 당신은 화려하면서도 사랑스러운 꽃, 프리지아처럼 다정합니다.",
    flowerMeaning: "시작, 순수, 천진난만",
  },
  ESTJ: {
    flowerId: 5, // 해바라기
    flower: "해바라기",
    image: sunbaragi,
    description:
      "무너진 질서를 다시 세우고, 중심을 잡아주는 당신. 강한 책임감과 판단력으로 모두를 이끌며 실천하는 힘. 우직한 해바라기 같지만, 그 안엔 누구보다 뜨거운 열정이 있습니다.",
    flowerMeaning: "숭배, 기다림, 동경",
  },
  ESFJ: {
    flowerId: 6, // 분홍카네이션
    flower: "분홍 카네이션",
    image: cane,
    description:
      "사람들을 챙기고, 보살피고, 늘 웃는 얼굴로 안아주는 당신. 주변의 분위기를 살피며 모두가 편하길 바라는 따뜻한 리더. 분홍 카네이션처럼 누군가에게 늘 고마운 존재예요.",
    flowerMeaning: "당신을 열렬히 사랑합니다",
  },
  ENTJ: {
    flowerId: 7, // 붉은장미
    flower: "붉은 장미",
    image: rose,
    description:
      "생각만 하지 않고, 실제로 해내는 당신. 정확하고 냉철하게 판단하며 큰 그림을 그리고 이끄는 능력. 거센 바람 속에서도 꿋꿋하게 피는 붉은 장미처럼 강하고 아름답습니다.",
    flowerMeaning: "사랑, 아름다움, 열정",
  },
  ENTP: {
    flowerId: 8, // 작약
    flower: "튤립",
    image: tulrip, // tulrip 변수에 다른 이미지 연결돼 있으면 교체 필요
    description:
      "새로운 아이디어가 끊이지 않고, 도전을 즐기는 당신. 틀을 깨고 다른 관점에서 세상을 바라보는 창조적인 두뇌. 자유롭고 예측 불가능한 매력, 튤립처럼 유쾌하고 다채로운 사람입니다.",
    flowerMeaning: "사랑의 고백, 영원한 애정",
  },
  ENFP: {
    flowerId: 22, 
    flower: "코스모스",
    image: cosmos,
    description:
      "사람에게 진심이고, 감정에 솔직한 당신. 에너지가 넘치고 따뜻하며, 세상과 사람을 사랑하는 그 마음. 알록달록한 꽃밭처럼 다채롭고 생기 넘치는 코스모스 같아요.",
    flowerMeaning: "순정, 평화, 사랑",
  },
  ENFJ: {
    flowerId: 23, // 백합은 DB에 없음 → 임시로 국화 ID, 추후 교체
    flower: "백합",
    image: backhap,
    description:
      "타인의 가능성을 누구보다 먼저 알아보고 응원하는 당신. 사람들에게 영감을 주고, 그들과 함께 성장하려는 따뜻한 리더. 흔들려도 중심을 잃지 않는 백합처럼 곧고 맑은 사람입니다.",
    flowerMeaning: "순결, 변함없는 사랑",
  },
};



const FirstSurvey = () => {
    const navigate = useNavigate(); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleAnswer = (optionIndex) => {
        setSelectedOption(optionIndex);

        const currentQuestion = questions[currentQuestionIndex];
        let updatedAnswers = { ...answers };

        switch (currentQuestion.id) {
            case 1: optionIndex === 0 ? updatedAnswers.I++ : updatedAnswers.E++; break;
            case 2: optionIndex === 0 ? updatedAnswers.S++ : updatedAnswers.N++; break;
            case 3: optionIndex === 0 ? updatedAnswers.T++ : updatedAnswers.F++; break;
            case 4: optionIndex === 0 ? updatedAnswers.J++ : updatedAnswers.P++; break;
            case 5: optionIndex === 0 ? updatedAnswers.I++ : updatedAnswers.E++; break;
            case 6: optionIndex === 0 ? updatedAnswers.S++ : updatedAnswers.N++; break;
            case 7: optionIndex === 0 ? updatedAnswers.T++ : updatedAnswers.F++; break;
            case 8: optionIndex === 0 ? updatedAnswers.J++ : updatedAnswers.P++; break;
            case 9: optionIndex === 0 ? updatedAnswers.S++ : updatedAnswers.N++; break;
            case 10: optionIndex === 0 ? updatedAnswers.I++ : updatedAnswers.E++; break;
            case 11: optionIndex === 0 ? updatedAnswers.T++ : updatedAnswers.F++; break;
            case 12: optionIndex === 0 ? updatedAnswers.J++ : updatedAnswers.P++; break;
            default: break;
        }

        setAnswers(updatedAnswers);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 300);
    };

    const calculateMbti = () => {
        let mbti = "";
        mbti += answers.E >= answers.I ? "E" : "I";
        mbti += answers.N >= answers.S ? "N" : "S";
        mbti += answers.T >= answers.F ? "T" : "F";
        mbti += answers.J >= answers.P ? "J" : "P";
        return mbti;
    };

    return (
        <div style={{
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            padding: '80px 0'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                padding: '30px',
                width: '90%',
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                {!showResult ? (
                    <>
                        <div style={{
                            width: '100%',
                            backgroundColor: '#eee',
                            borderRadius: '5px',
                            height: '10px',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                backgroundColor: '#ff99aa',
                                height: '100%',
                                borderRadius: '5px'
                            }}></div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px' }}>
                            {currentQuestionIndex + 1}/{questions.length}
                        </p>
                        <h2 style={{ fontSize: '24px', marginBottom: '50px', color: '#333' }}>
                            Q{questions[currentQuestionIndex].id}. {questions[currentQuestionIndex].text}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {questions[currentQuestionIndex].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`survey-option ${selectedOption === index ? 'selected' : ''}`}
                                >
                                    {String.fromCharCode(65 + index)}. {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff99aa', marginBottom: '10px' }}>
                            🌸 당신에게 어울리는 꽃은
                        </p>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
                            {mbtiResults[calculateMbti()].flower}
                        </p>
                        <img
                            src={mbtiResults[calculateMbti()].image}
                            alt={mbtiResults[calculateMbti()].flower}
                            style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '15px', marginBottom: '30px' }}
                        />
                        <div style={{ color: '#555', lineHeight: '1.6', fontSize: '16px', marginBottom: '40px' }}>
                            {mbtiResults[calculateMbti()].description}
                        </div>
                        <div style={{ backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff99aa', marginBottom: '10px' }}>꽃말</p>
                            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>
                                "{mbtiResults[calculateMbti()].flowerMeaning}"
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                            onClick={() => {
                                const result = mbtiResults[calculateMbti()];
                                if (!result || !result.flowerId) {
                                console.error("flowerId 없음", result);
                                return;
                                }
                                navigate(`/flower/${result.flowerId}`);
                            }}
                            className="survey-option"
                            >
                            이 꽃 알아보기
                            </button>
                            <button
                                onClick={() => navigate('/survey/start')}
                                className="survey-option"
                            >
                                다시 하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FirstSurvey;
