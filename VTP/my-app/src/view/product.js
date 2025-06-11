import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Classify_cpn from '../components/product/classify_cpn';
import Product_cpn from '../components/product/product_cpn';
import ProductDetail_cpn from '../components/product/product_details';

function Product() {
    const { selectedCategory, selectedClassify, selectedProduct } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedCategory) {
            navigate('/home');
        }
    }, [selectedCategory, navigate]);

    return (
        <div>
            <Classify_cpn />
            {selectedClassify ? (
                selectedProduct ? <ProductDetail_cpn /> : <Product_cpn />
            ) : (
                <p></p>
            )}
        </div>
    );
}

export default Product;
