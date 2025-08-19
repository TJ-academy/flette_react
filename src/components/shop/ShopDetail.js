import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {useNavigate, useParams} from 'react-router-dom';
import ShopReview from "./ShopReview";
import ShopQa from "./ShopQA";
import ShopQaWrite from "./ShopQaWrite";
import ShopInfo from "./ShopInfo";

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(url)
        .then((response) => {
            //console.log( 'data:'+JSON.stringify(response.data));
            setData(response.data);
            setLoading(false);
        });
    }, [url]);
    return [data, loading];
}

function ShopDetail() {
    const {productId} = useParams();
    const [data, loading] = useFetch(`http://localhost/api/shop/${productId}/detail`);
    const [activeTab, setActiveTab] = useState('details');
    //const [expandedReviewId, setExpandedReviewId] = useState(null);
    const navigate = useNavigate();

    
    const renderContent = () => {
        switch(activeTab) {
            case 'details' :
                return <ShopInfo />;
            case 'reviews' :
                return <ShopReview />;
            case 'qa' :
                return <ShopQa 
                    onWriteClick={() => setActiveTab('qaWrite')} />;
            case 'qaWrite':
                return <ShopQaWrite 
                    onCancel={() => setActiveTab('qa')}
                    onSubmitSuccess={() => setActiveTab('qa')} />;
            default:
                return null;
        }
    };

    if(loading) {
        return <div>loading</div>;
    } else if(!data || !data.dto) {
        return <div>상품 정보를 불러올 수 없습니다.</div>;
    } else {
        return (
            <>
                <div>
                    {data.dto.imageName && (
                        <img
                            src={`http://localhost:80/img/product/${data.dto.imageName}`}
                            alt="상품 이미지"
                            width={300}
                            height={300}
                        />
                    )}
                    <p><strong>{data.dto.productName}</strong></p>
                    <p>{data.dto.basicPrice.toLocaleString()} ~ </p>
                </div>
                <div>
                    <button onClick={() => setActiveTab('details')}>상세정보</button>
                    <button onClick={() => setActiveTab('reviews')}>리뷰</button>
                    <button onClick={() => setActiveTab('qa')}>Q&A</button>
                </div>
                <br />

                <div>
                    {renderContent()}
                </div>
            </>
        )
    }
}

export default ShopDetail;