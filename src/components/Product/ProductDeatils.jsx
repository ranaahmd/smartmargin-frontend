import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authRequest, getTokens } from '../../lib/auth';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        else loadProduct();
    }, [navigate, id]);

    const loadProduct = async () => {
        try {
            const response = await authRequest({ method: 'GET', url: `http://127.0.0.1:8000/api/products/${id}/` });
            setProduct(response.data);
        } catch (err) {
            console.error('Error loading product');
        }
    };

}

export default ProductDetail