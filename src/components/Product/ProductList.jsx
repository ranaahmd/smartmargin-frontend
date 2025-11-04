import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRequest, getTokens } from '../../lib/auth';
import "../../App.css";
import catbaking from '../../assets/catbaking.png'
import catshop from '../../assets/catshop.png'
import { ChefHat } from 'lucide-react';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const productImages = [catbaking, catshop];

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        else fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await authRequest({ method: 'GET', url: 'http://127.0.0.1:8000/api/products/' });
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

    const showProductDetails = (product) => {
        setSelectedProduct(product);
    };

    const closeProductDetails = () => {
        setSelectedProduct(null);
    };

    const getProductImage = (product, index) => {
        if (product.image_url) {
            return product.image_url;
        }
        return productImages[index % productImages.length];
    };

    return (
        <section id="products-section" className="py-12 bg-[#2d2d2d] min-h-screen"> 
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold flex items-center gap-2">My Products </h2>
                    <button 
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                        onClick={() => navigate('/products/add')}
                    >
                        + Add New Product
                    </button>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="borde-product" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-amber-200 rounded-2xl p-8 text-center">
                        <img 
                            src={catbaking} 
                            alt="No products"
                            className="w-32 h-32 mx-auto mb-4 object-cover rounded-lg"
                        />
                        <p className="text-gray-700 text-lg">No products found</p>
                        <button 
                            className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full mt-4 hover:bg-[#444] transition-all"
                            onClick={() => navigate('/products/add')}
                        >
                            Create Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div 
                                key={product.id}
                                className="bg-amber-200 rounded-2xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <div className="mb-4 text-center">
                                    <img 
                                        src={getProductImage(product, index)} 
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-xl mb-3 shadow-lg"
                                    />
                                </div>

                                <div className="text-center mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                    <div className="flex justify-between text-sm text-gray-700 mb-4">
                                        <span>Cost: ${product.total_cost || 0}</span>
                                        <span>Price: ${product.selling_price || 0}</span>
                                    </div>
                                    <div className="bg-[#b6723c] text-white px-4 py-1 rounded-full inline-block">
                                        Profit: {product.profit_percentage
 || 0}%
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center">
                                    <button 
                                        className="bg-[#2d2d2d] text-white px-4 py-2 rounded-full hover:bg-[#444] transition-all text-sm"
                                        onClick={() => showProductDetails(product)}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all text-sm"
                                        onClick={() => navigate(`/products/edit/${product.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all text-sm"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-amber-200 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h3>
                                <button 
                                    onClick={closeProductDetails}
                                    className="text-gray-700 hover:text-gray-900 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="mb-6 text-center">
                                <img 
                                    src={getProductImage(selectedProduct, products.findIndex(p => p.id === selectedProduct.id))} 
                                    alt={selectedProduct.name}
                                    className="w-64 h-64 object-cover rounded-xl mx-auto shadow-lg"
                                />
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 mb-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300">
                                            <th className="pb-2 text-gray-700">Metric</th>
                                            <th className="pb-2 text-gray-700">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-semibold text-gray-700">Total Cost</td>
                                            <td className="py-3 text-gray-900">${selectedProduct.total_cost || 0}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-semibold text-gray-700">Selling Price</td>
                                            <td className="py-3 text-gray-900">${selectedProduct.selling_price || 0}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-semibold text-gray-700">Profit Margin</td>
                                            <td className="py-3 text-gray-900">{selectedProduct.profit_percentage || 0}%</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-gray-700">Profit Amount</td>
                                            <td className="py-3 text-gray-900">
                                                ${((selectedProduct.selling_price || 0) - (selectedProduct.total_cost || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <button 
                                    className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full hover:bg-[#444] transition-all"
                                    onClick={() => navigate(`/products/${selectedProduct.id}`)}
                                >
                                    Full Details
                                </button>
                                <button 
                                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all"
                                    onClick={() => navigate(`/products/edit/${selectedProduct.id}`)}
                                >
                                    Edit Product
                                </button>
                                <button 
                                    className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all"
                                    onClick={closeProductDetails}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductsList;