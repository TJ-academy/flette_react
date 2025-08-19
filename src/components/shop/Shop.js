import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/shop/shop.css';

function ShopList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); 
  
  // 상품 데이터 불러오기
  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://localhost/api/shop`);
      setProducts(res.data);
    } catch (error) {
      console.error("상품 데이터를 불러오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSelectProduct = (id) => {
    setSelectedProduct(id);
  };

  const handleSelectButtonClick = () => {
    if (selectedProduct) {
      navigate(`/shop/${selectedProduct}/detail`);
    }
  };

  return (
    <>
      {/* 상단 배너 */}
      <section className="main-banner">
        <img
          src="/img/main.png"
          alt="메인 배너"
          className="banner-img"
        />
      </section>

      <div className="shop-list">
        <div className="shop-header">
          <h2>꽃다발 크기를 선택하세요</h2>
          <p>사이즈별 구성과 가격을 확인하시고, 원하는 크기를 선택해주세요.</p>
        </div>
        <hr className="section-divider" />

        {/* 상품 카드 리스트 */}
        <div className="product-cards">
          {products.map((product) => (
            <label 
              key={product.productId} 
              className={`product-card ${selectedProduct === product.productId ? 'selected' : ''}`}
              onClick={() => handleSelectProduct(product.productId)}
            >
              {/* 커스텀 선택 점 */}
              <span className={`select-dot ${selectedProduct === product.productId ? 'on' : ''}`}></span>

              <img
                src={`http://localhost:80/img/product/${product.imageName}`}
                alt={product.productName}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p className="product-price">
                  {product.basicPrice.toLocaleString()}원 ~ 
                </p>
                <p className="product-summary">
                  {product.summary.split('/').map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </label>
          ))}
        </div>

        <hr className="section-divider" />

        {/* 선택 버튼 */}
        <button 
          className="select-button" 
          disabled={!selectedProduct} 
          onClick={handleSelectButtonClick}
        > 
          선택하기
        </button>
      </div>
    </>
  );
}

export default ShopList;
