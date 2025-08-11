import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopList from './components/shop/Shop';
import ShopDetail from './components/shop/ShopDetail';

function ShopApp(){
    return (
        <Routes>
            <Route path="" element={<ShopList />} />
            <Route path=":productId" element={<ShopDetail />} />
        </Routes>
    );
}

export default ShopApp;