import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link, useParams, useNavigate} from 'react-router-dom';
import ShopQaWrite from "./ShopQaWrite";

function ShopQa() {
    const [lists, setLists] = useState([]);
    const {productId} = useParams();
    const [errorMessages, setErrorMessages] = useState({});
    const [expandedId, setExpandedId] = useState(null);
    const [details, setDetails] = useState({});
    const [passwordInputs, setPasswordInputs] = useState({});
    const formattedDate = (isoString) => isoString.slice(2, 10);
    const navigate = useNavigate();

    const loadLists = async () => {
        const res = await axios.get(`http://localhost/api/shop/${productId}/qa`);
        console.log(JSON.stringify(res.data));
        setLists(res.data);
    };

    useEffect(() => {
        loadLists();
    }, []);

    // 아이디 마스킹
    const maskId = (id) => {
        if (id.length <= 3) return id + '***';
        return id.slice(0, 3) + '*'.repeat(id.length - 3);
    };

    //제목 클릭했을 때
    const titleClick = async (list) => {
        const qid = list.questionId;

        // 이미 열려있으면 닫기
        if (expandedId === qid) {
            setExpandedId(null);
            return;
        }

        // 공개글인 경우, 그냥 detail 보여주기
        if (!list.passwd || list.passwd.trim() === "") {
            setDetails(prev => ({ ...prev, [qid]: list }));
            setExpandedId(qid);
        } else {
            // 비밀글인 경우 → 비번 입력 칸만 열기
            setExpandedId(qid);
        }
    };

    const checkPassword = async (questionId) => {
        try {
            const res = await axios.post(
                `http://localhost/api/shop/${productId}/qa/${questionId}/check`,
                { passwd: passwordInputs[questionId] }
            );
            if (res.data && res.data.dto) {
                setDetails(prev => ({ ...prev, [questionId]: res.data.dto }));
                setErrorMessages(prev => ({ ...prev, [questionId]: "" }));
            } else {
                setErrorMessages(prev => ({ ...prev, [questionId]: res.data.message }));
            }
        } catch (err) {
            setErrorMessages(prev => ({ ...prev, [questionId]: "오류가 발생했습니다." }));
        }
    };


    return (
        <>
            <h2>회원만 작성 가능한 게시판입니다.</h2>
            
            <button onClick={(e) => {
                const isLoggedIn = sessionStorage.getItem('loginId') !== null;
                console.log("로그인했나요? => " + isLoggedIn);
                if(!isLoggedIn) {
                    e.preventDefault();
                    const goLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인하겠습니까?");
                    if(goLogin) {
                        navigate("/member/login");
                    }
                } else {
                    navigate(`/shop/${productId}/qa/write`);
                }
            }}>Q&A 작성하기</button>

            <table>
                <thead>
                    <tr>
                        <th>답변 상태</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((list) => (
                        <React.Fragment key={list.questionId}>
                            <tr>
                                <td>{list.status ? "답변 완료" : "답변 대기"}</td>
                                <td>
                                    <div onClick={() => titleClick(list)}
                                        style={{ cursor: "pointer", color: list.passwd ? "gray" : "black" }}>
                                        {list.passwd ? "비밀글입니다. 🔒" : list.title}
                                    </div>
                                </td>
                                <td>{maskId(list.userid)}</td>
                                <td>{formattedDate(list.questionDate)}</td>
                            </tr>

                            {expandedId === list.questionId && (
                                <tr>
                                    <td colSpan={4}>
                                        {/* 비밀글 → 비밀번호 확인 필요 */}
                                        {list.passwd && !details[list.questionId] ? (
                                            <div>
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    checkPassword(list.questionId);
                                                }}>
                                                    <input type="password" placeholder="비밀번호 입력"
                                                        value={passwordInputs[list.questionId] || ""}
                                                        onChange={(e) =>
                                                            setPasswordInputs(prev => ({
                                                                ...prev,
                                                                [list.questionId]: e.target.value
                                                            }))
                                                        }
                                                    />
                                                    <button type="submit">확인</button>
                                                </form>
                                                
                                                {errorMessages[list.questionId] && (
                                                    <div style={{ color: "red" }}>
                                                        {errorMessages[list.questionId]}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            // 공개글 detail 또는 비밀번호 확인된 detail
                                            details[list.questionId] && (
                                                <div>
                                                    <div><strong>질문 내용:</strong> {details[list.questionId].content}</div>
                                                    {details[list.questionId].status && (
                                                        <div style={{ marginTop: "10px", background: "#f4f4f4", padding: "10px" }}>
                                                            <strong>[답변]</strong><br />
                                                            {details[list.questionId].answerContent}<br />
                                                            <span style={{ fontSize: "0.9em", color: "gray" }}>
                                                                작성자: 판매자 / {details[list.questionId].answerDate}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ShopQa;