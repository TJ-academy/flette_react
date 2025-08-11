import axios from "axios";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

function ShopList() {
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        const res = await axios.get('http://localhost:8080/api/shop');
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
                        <th>최소가격</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.productId}>
                            <td>{p.productId}</td>
                            <td>
                                <Link to={`/shop/${p.productId}`}>{p.productName}</Link>
                            </td>
                            <td>{p.basicPrice}</td>
                            <td>{p.summary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ShopList;