import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/shop/shopqawrite.css';

const ShopQaWrite = ({ onCancel, onSubmitSuccess }) => {
    const { productId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [passwd, setPasswd] = useState('');
    const userid = sessionStorage.getItem('loginId') || '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post(`https://sure-dyane-flette-f3f77cc0.koyeb.app/api/shop/${productId}/qa/write`, {
                productId,
                userid,
                title,
                content,
                passwd: passwd.trim() === '' ? null : passwd
            });

            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error) {
            console.error('Q&A 작성 중 오류 발생: ', error);
        }
    };

    return (
        <div className="qa-write-container">
            <h2>Q&A 작성</h2>
            <form onSubmit={handleSubmit}>
                {/* 제목 */}
                <label htmlFor="title">제목</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {/* 비밀번호 */}
                <label htmlFor="passwd">비밀번호 (비밀글 작성 시)</label>
                <input
                    id="passwd"
                    type="password"
                    value={passwd}
                    onChange={(e) => setPasswd(e.target.value)}
                />

                {/* 내용 */}
                <label htmlFor="content">내용</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                {/* 버튼 영역 */}
                <div className="qa-write-buttons">
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        취소
                    </button>
                    <button type="submit" className="submit-btn">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShopQaWrite;
