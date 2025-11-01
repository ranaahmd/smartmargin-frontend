import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRequest, getTokens, clearTokens } from '../../lib/auth';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        else fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await authRequest({
                method: 'GET',
                url: 'http://127.0.0.1:8000/api/products/'
            });
            setProducts(response.data);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Delete this product?')) {
            await authRequest({ method: 'DELETE', url: `/api/products/${id}/` });
            fetchProducts();
        }
    };
    return (
    <div className="container-product">
         <div className="prod-header"><h2>Products</h2><div>
            <button className="btn-addproduct" onClick={() => navigate('/products/add')}>+ Add Product</button>
            <button className="btn-logout" onClick={() => { clearTokens(); navigate('/login'); }}>Logout</button>
                </div>
            </div>
            {/* copied from reddiet */}
            {loading ? (
                <div className="create-p"><div className="border-product" /></div>
            ) : products.length === 0 ? (
                <div className="p-info">Create your first product!</div>
            ) : (<div className="table-product"><table className="p-table"><thead className="th-p">
                <tr>
                    <th>Product Name</th>
                    <th>Total Cost</th>
                    <th>Selling Price</th>
                    <th>Profit Margin</th>
                    <th>Actions</th>
                </tr></thead><tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>${product.total_cost }</td>
                            <td>${product.selling_price }</td>
                            <td>{product.profit_margin }%</td><td>
                                <button className="btn-pro" onClick={() => navigate(`/products/${product.id}`)}> View</button>
                                <button className="btn-editproduct" onClick={() => navigate(`/products/edit/${product.id}`)}>Edit</button>
                                <button className="btn-deleteproduct"onClick={() => deleteProduct(product.id)}>Delete</button></td></tr>))}
                                </tbody>
                                </table>
                                </div>
                            )}
                             </div>
                             );
                            };

export default ProductsList