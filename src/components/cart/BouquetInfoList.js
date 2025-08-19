import React from "react";
import '../../css/BouquetInfoList.css';

export default function BouquetInfoList({ bouquetInfoList }) {
    if (!bouquetInfoList || bouquetInfoList.length === 0) return null;

    // 카테고리 순서 지정
    const categoryOrder = ["MAIN", "SUB", "FOLIAGE", "WRAPPING", "ADDITIONAL"];

    // 카테고리별로 그룹화
    const grouped = categoryOrder.map((category) => ({
        category,
        items: bouquetInfoList.filter((b) => b.category === category),
    }));

    return (
        <div  className="cart-option-info">
            {grouped.map(({ category, items }) => {
                if (items.length === 0)
                    return null;

                // MAIN, SUB, FOLIAGE
                if (["MAIN", "SUB", "FOLIAGE"].includes(category)) {
                    return (
                        <div key={category} className="flower-info">
                            <div className="bouquet-info-category">{category}</div>
                            <div className="bouquet-info-name">
                                {items.map((item, index) => (
                                    <div key={index}>{item.name}</div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // WRAPPING, ADDITIONAL
                return (
                    <div key={category}>
                        {items.map((item, index) => {
                            if (!item.addPrice || item.addPrice === 0) return null;

                            return (
                                <div key={`${category}-${index}`} className="deco-info">
                                    <div className="bouquet-info-category">
                                        {index === 0 ? category : ""}
                                    </div>
                                    <span className="bouquet-info-name">{item.name}</span>
                                    <span className="bouquet-info-price">
                                        +{item.addPrice.toLocaleString()}원
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}