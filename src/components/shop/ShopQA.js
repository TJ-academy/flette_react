import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link, useParams, useNavigate} from 'react-router-dom';
import '../../css/shopQA.css';

function ShopQa({ onWriteClick }) {
    const [lists, setLists] = useState([]);
    const {productId} = useParams();
    const [errorMessages, setErrorMessages] = useState({});
    const [expandedId, setExpandedId] = useState(null);
    //const [details, setDetails] = useState({});
    const [passwordInputs, setPasswordInputs] = useState({});
    const formattedDate = (isoString) => isoString.slice(2, 10);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const loadLists = async (page = 1) => {
    const res = await axios.get(`http://localhost/api/shop/${productId}/qa?page=${page - 1}&size=${itemsPerPage}`);
    
        setLists(res.data.list);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage + 1);
        setTotalItems(res.data.totalItems);
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
        } else {
            setExpandedId(qid);
        }
    };

    const checkPassword = async (questionId) => {
        try {
            const res = await axios.post(
                `http://localhost/api/shop/${productId}/qa/${questionId}/check`,
                { passwd: passwordInputs[questionId] }
            );
            if (res.data.success) {
                setErrorMessages(prev => ({ ...prev, [questionId]: "" }));
                setLists(prev =>
                    prev.map(item =>
                        item.questionId === questionId
                            ? { ...item, passwordVerified: true }
                            : item
                    )
                );
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
                // console.log("로그인했나요? => " + isLoggedIn);
                if(!isLoggedIn) {
                    e.preventDefault();
                    const goLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인하겠습니까?");
                    if(goLogin) {
                        navigate("/member/login");
                    }
                } else {
                    // navigate(`/shop/${productId}/qa/write`);
                    onWriteClick();
                }
            }}>Q&A 작성하기</button>

            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>답변 상태</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((list, index) => (
                        <React.Fragment key={list.questionId}>
                            <tr className={expandedId === list.questionId ? "quesSum highlight-row" : "quesSum"}>
                                <td className="t-index">{totalItems - ((currentPage - 1) * itemsPerPage + index)}</td>
                                <td className="t-status">{list.status ? "답변 완료" : "답변 대기"}</td>
                                <td className="t-title" onClick={() => titleClick(list)}>
                                    {list.passwd ? (
                                        <div className="secret">
                                            비밀글입니다. 🔒
                                        </div>
                                    ) : (
                                        <div className="public">
                                            {list.title}
                                        </div>
                                    )}
                                </td>
                                <td className="t-writer">{maskId(list.userid)}</td>
                                <td className="t-date">{formattedDate(list.questionDate)}</td>
                            </tr>

                            {expandedId === list.questionId && (
                                <>
                                    {/* 비밀글 → 비밀번호 확인 필요 */}
                                    {list.passwd && !list.passwordVerified ? (
                                        <tr className="quesPaswd">
                                            <td colSpan={5}>
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
                                                        <div className="error-message">
                                                            {errorMessages[list.questionId]}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {/* 공개글 detail 또는 비밀번호 확인된 detail */}
                                            <tr className="quesContent">
                                                <td colSpan={2}></td>
                                                <td>{list.content}</td>
                                                <td colSpan={2}></td>
                                            </tr>
                                            
                                            {list.status && (
                                                <tr className="answer">
                                                    <td colSpan={2}></td>
                                                    <td className="content">
                                                        <strong>[답변]</strong><br />
                                                        {list.answerContent}
                                                    </td>
                                                    <td>판매자</td>
                                                    <td>{formattedDate(list.answerDate)}</td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => loadLists(i + 1)}
                    >{i + 1}</button>
                ))}
            </div>
        </>
    );
};

export default ShopQa;