import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {useNavigate, useParams} from 'react-router-dom';
import ShopReview from "./ShopReview";

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(url)
        .then((response) => {
            setData(response.data);
            setLoading(false);
        });
    }, [url]);
    return [data, loading];
}

function ShopDetail() {
    const {productId} = useParams();
    const [data, loading] = useFetch('http://localhost/api/shop/' + productId);
    const [activeTab, setActiveTab] = useState('details');
    //const [expandedReviewId, setExpandedReviewId] = useState(null);
    const navigate = useNavigate();

    
    const renderContent = () => {
        switch(activeTab) {
            case 'details' :
                return (
                    <div>
                        상품의 상세정보
                    </div>
                );
            case 'reviews' :
                return <ShopReview />;
            case 'qa' :
                return (
                    <div>
                        Q&A
                    </div>
                );
            default:
                return null;
        }
    };

    if(loading) {
        return <div>loading</div>;
    } else {
        let src = '';
        let image_url = '';
        if(data.dto.imageName !== '') {
            src = `http://localhost/images/${data.dto.imageName}`;
            image_url = `<img src=${src} width='300px' height='300px' />`;
        } else {
            image_url = '';
        }

        return (
            <>
                <div>
                    꽃다발 이미지
                    <p><strong>{data.dto.productName}</strong></p>
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