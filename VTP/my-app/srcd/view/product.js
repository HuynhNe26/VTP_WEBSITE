import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Classify_cpn from '../components/product/classify_cpn';
import Product_cpn from '../components/product/product_cpn';

function Product() {
    const { selectedCategory, selectedClassify } = useParams();
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
                <Product_cpn />
            ) : (
                <p></p>
            )}
        </div>
    );
}

export default Product;