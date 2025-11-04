import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authRequest, getTokens } from '../../lib/auth';
import "../../App.css";
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

   if (!product) return <div className="text-center"><div className="di" /></div>;

    return (
        <div className="container-product">
            <div className="product-item">
                <h2>{product.name}</h2>
                <button className="btn-back" onClick={() => navigate('/products')}>Back</button>
            </div>
            <div className="row">
                <div className="card-display -colm">
                    <div className="card">
                        <div className="card-ingredients">
                            <h5>Ingredients</h5>
                            {product.ingredients?.length > 0 ? 
                                <table className="table-str">
                                    <thead><tr><th>Ingredient</th><th>Qty</th><th>Cost</th></tr></thead>
                                    <tbody>
                                        {product.ingredients.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.ingredient_name}</td>
                                                <td>{item.quantity} {item.unit}</td>
                                                <td>${item.total_cost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table> : 
                                <p>No ingredients</p>}
                        </div>
                    </div>
                </div>
                <div className="card-proftdisplay">
                    <div className="card">
                        <div className="card-profit">
                            <h5 className='header-pricing'>Pricing</h5>
                            <div><strong>Total Cost:</strong> ${product.total_cost}</div>
                            <div><strong>Profit Margin:</strong> {product.profit_percentage
 }</div>
                            <div><strong>Profit:</strong> ${product.profit_amount }</div>
                            <div><strong>Selling Price:</strong> ${product.selling_price }</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail