import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/shop/shop.css';

function ShopList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); 
  
  // 백엔드에서 상품 데이터를 불러오는 함수
  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://localhost/api/shop`);
      setProducts(res.data);
    } catch (error) {
      console.error("상품 데이터를 불러오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    loadProducts(); // 컴포넌트가 마운트될 때 API 호출
  }, []);

  const handleSelectProduct = (id) => {
    setSelectedProduct(id);
  };

  const handleSelectButtonClick = () => {
    if (selectedProduct) {
      navigate(`/shop/${selectedProduct}/detail`); // 선택된 상품 ID를 URL에 포함시켜 이동
    }
  };

  return (
    <>
    <section className="main-banner">
      <img
        src="https://images.unsplash.com/photo-1531120364508-a6b656c3e78d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // 더미 이미지 링크
        alt="메인 배너"
        className="banner-img"
      />
    </section>
   

    <div className="shop-list">
      <div className="shop-header">
        <h2>꽃다발 크기를 선택하세요</h2>
        <p>사이즈별 구성과 가격을 확인하시고, 원하는 크기를 선택해주세요.</p>
      </div>

      <div className="product-cards">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            <input
              type="radio"
              id={`product-${product.productId}`}
              name="product"
              className="product-radio"
              checked={selectedProduct === product.productId}
              onChange={() => handleSelectProduct(product.productId)}
            />
            <label htmlFor={`product-${product.productId}`} className="product-card-label">
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
          </div>
        ))}
      </div>

      <button className="select-button" disabled={!selectedProduct} onClick={handleSelectButtonClick}> 
        선택하기
      </button>
    </div>

     </>
  );
}

export default ShopList;
