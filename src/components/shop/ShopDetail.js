import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShopReview from "./ShopReview";
import ShopQa from "./ShopQA";
import ShopQaWrite from "./ShopQaWrite";
import ShopInfo from "./ShopInfo";
import "../../css/shop/shopdetail.css";

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
  const { productId } = useParams();
  const [data, loading] = useFetch(
    `http://localhost/api/shop/${productId}/detail`
  );
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <>
            {/* ✅ 상세정보 탭에서만 추천 PICK 노출 */}
            <div className="recommend-pick">
              <img
                src="/img/pick.png"
                alt="추천 PICK"
                className="recommend-pick-img"
              />
            </div>

            {/* ✅ 추천 PICK 바로 밑에만 구분선 노출 */}
            <div className="shop-detail-divider" />

            <ShopInfo />
          </>
        );
      case "reviews":
        return <ShopReview />;
      case "qa":
        return <ShopQa onWriteClick={() => setActiveTab("qaWrite")} />;
      case "qaWrite":
        return (
          <ShopQaWrite
            onCancel={() => setActiveTab("qa")}
            onSubmitSuccess={() => setActiveTab("qa")}
          />
        );
      default:
        return null;
    }
  };

  if (loading) return <div>loading...</div>;
  if (!data || !data.dto) return <div>상품 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="shop-detail-container">
      {/* 상품 상단 영역 */}
      <div className="shop-detail-header">
        {data.dto.imageName && (
          <img
            className="shop-detail-image"
            src={`http://localhost:80/img/product/${data.dto.imageName}`}
            alt={data.dto.productName}
          />
        )}
        <h2 className="shop-detail-title">{data.dto.productName}</h2>
        <p className="shop-detail-price">
          {data.dto.basicPrice.toLocaleString()} ~
        </p>
      </div>

      {/* 탭 버튼 */}
      <div className="shop-detail-tabs">
        <button
          onClick={() => setActiveTab("details")}
          className={activeTab === "details" ? "active" : ""}
        >
          상세정보
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={activeTab === "reviews" ? "active" : ""}
        >
          리뷰
        </button>
        <button
          onClick={() => setActiveTab("qa")}
          className={activeTab === "qa" ? "active" : ""}
        >
          Q&amp;A
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="shop-detail-content">{renderContent()}</div>
    </div>
  );
}

export default ShopDetail;
