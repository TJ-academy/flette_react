import axios from "axios";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

function ShopList() {
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        const res = await axios.get('http://localhost/api/shop');
        console.log(JSON.stringify(res.data));
        setProducts(res.data);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <>
            <h2>상품 리스트</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>이미지</th>
                        <th>최소가격</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>
                                <Link to={`/shop/${product.productId}`}>{product.productName}</Link>
                            </td>
                            <td>{product.imageName}</td>
                            <td>{product.basicPrice}</td>
                            <td>{product.summary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ShopList;