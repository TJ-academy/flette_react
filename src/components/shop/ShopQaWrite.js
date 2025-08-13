import axios from 'axios';
import {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ShopQaWrite = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [passwd, setPasswd] = useState('');
    const [userid, setUserid] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
                await axios.post(`http://localhost/api/shop/${productId}/qa/write`, {
                    productId,
                    userid,
                    title,
                    content,
                    passwd: passwd.trim() === '' ? null : passwd
                });
            navigate('http://localhost/api/shop/${productId}/qa/');
        } catch(error) {
            console.error('Q&A 작성 중 오류 발생: ', error);
        }
    };

    return (
        <div>
            <h2>Q&A 작성</h2>
            <form onSubmit={handleSubmit}>
                <label>제목: 
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label><br />
                <label>비밀번호 (비밀글 작성 시): 
                    <input type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} />
                </label><br />
                <label>내용: 
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </label><br />
                
                <button type="submit">작성</button>
            </form>
        </div>
    );
};

export default ShopQaWrite;