import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopList from './components/shop/Shop';
import ShopDetail from './components/shop/ShopDetail';
import ShopReview from './components/shop/ShopReview';
import ShopQa from './components/shop/ShopQA';
import ShopQaWrite from './components/shop/ShopQaWrite';

function ShopApp(){
    return (
        <Routes>
            <Route path="" element={<ShopList />} />
            <Route path=":productId" element={<ShopDetail />} />
            <Route path=":productId/review" element={<ShopReview />} />
            <Route path=":productId/qa" element={<ShopQa />} />
            <Route path=":productId/qa/write" element={<ShopQaWrite />} />
        </Routes>
    );
}

export default ShopApp;