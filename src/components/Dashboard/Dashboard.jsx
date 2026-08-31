import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { TrendingUp, TrendingDown, Minus, DollarSign, Percent, PiggyBank, ReceiptText } from 'lucide-react';
import { authRequest, getTokens, clearTokens } from '../../lib/auth';
import { validateSaleForm, isValid } from '../../lib/validation';
import { formatCurrency, changeDirection, changeColor, buildRevenueSeries, buildTopProfitSeries, hasSalesData } from '../../lib/dashboard';
import { DashboardSkeleton } from '../Skeleton';
import littlemer from '../../assets/littlemer.png';

const API_BASE = 'http://127.0.0.1:8000/api';

const currentMonth = () => new Date().toISOString().slice(0, 7);

const ChangeBadge = ({ changePct }) => {
    const dir = changeDirection(changePct);
    const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
    return (
        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${changeColor(changePct)}`}>
            <Icon className="w-4 h-4" />
            {changePct === null || changePct === undefined ? 'n/a' : `${Math.abs(changePct).toFixed(1)}%`}
        </span>
    );
};

const SummaryCard = ({ icon: Icon, label, value, changePct }) => (
    <div className="bg-amber-200 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">{label}</span>
            <Icon className="w-5 h-5 text-[#b6723c]" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <ChangeBadge changePct={changePct} />
    </div>
);

const Dashboard = () => {
    const [month, setMonth] = useState(currentMonth());
    const [analytics, setAnalytics] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddSale, setShowAddSale] = useState(false);
    const [saleForm, setSaleForm] = useState({ product: '', quantity: '', soldAt: new Date().toISOString().slice(0, 10) });
    const [saleErrors, setSaleErrors] = useState({});
    const [saleSubmitError, setSaleSubmitError] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await authRequest({ method: 'GET', url: `${API_BASE}/analytics/monthly/?month=${month}` });
            setAnalytics(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
                return;
            }
            setError('Could not load your dashboard. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [month, navigate]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await authRequest({ method: 'GET', url: `${API_BASE}/products/` });
            setProducts(response.data);
        } catch {
            // Product list only backs the "add sale" dropdown; a silent miss
            // there isn't worth blocking the whole dashboard for.
        }
    }, []);

    useEffect(() => {
        if (!getTokens().access) {
            navigate('/login');
            return;
        }
        fetchAnalytics();
        fetchProducts();
    }, [fetchAnalytics, fetchProducts, navigate]);

    const openAddSale = () => {
        setSaleForm({ product: products[0]?.id ?? '', quantity: '', soldAt: new Date().toISOString().slice(0, 10) });
        setSaleErrors({});
        setSaleSubmitError('');
        setShowAddSale(true);
    };

    const submitSale = async (e) => {
        e.preventDefault();
        const errors = validateSaleForm({ product: saleForm.product, quantity: saleForm.quantity, soldAt: saleForm.soldAt });
        setSaleErrors(errors);
        if (!isValid(errors)) return;

        try {
            setSaving(true);
            setSaleSubmitError('');
            await authRequest({
                method: 'POST',
                url: `${API_BASE}/sales/`,
                data: { product: saleForm.product, quantity: saleForm.quantity, sold_at: saleForm.soldAt },
            });
            setShowAddSale(false);
            fetchAnalytics();
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
                return;
            }
            setSaleSubmitError(err.response?.data?.error || 'Could not record this sale. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const revenueSeries = analytics ? buildRevenueSeries(analytics.daily_revenue) : { categories: [], data: [] };
    const profitSeries = analytics ? buildTopProfitSeries(analytics.best_sellers_by_profit) : { categories: [], data: [] };

    return (
        <section className="py-12 bg-[#2d2d2d] min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-amber-100">
                        Your <span className="text-amber-200">Dashboard</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-amber-200 text-gray-900 rounded-full px-4 py-2 text-sm"
                        />
                        <button
                            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                            onClick={openAddSale}
                        >
                            + Record Sale
                        </button>
                    </div>
                </div>

                {loading ? (
                    <DashboardSkeleton />
                ) : error ? (
                    <div className="bg-red-100 text-red-800 rounded-2xl p-8 text-center">
                        <p className="mb-4">{error}</p>
                        <button className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full hover:bg-[#444]" onClick={fetchAnalytics}>
                            Retry
                        </button>
                    </div>
                ) : !hasSalesData(analytics) ? (
                    <div className="bg-amber-200 rounded-2xl p-8 text-center">
                        <img src={littlemer} alt="No sales yet" className="w-32 h-32 mx-auto mb-4 object-cover rounded-lg" />
                        <p className="text-gray-700 text-lg mb-4">No sales recorded for this month yet.</p>
                        <button
                            className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full hover:bg-[#444] transition-all"
                            onClick={openAddSale}
                            disabled={products.length === 0}
                        >
                            {products.length === 0 ? 'Add a product first' : 'Add Your First Sale'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <SummaryCard icon={DollarSign} label="Revenue" value={formatCurrency(analytics.revenue.total)} changePct={analytics.revenue.change_pct} />
                            <SummaryCard icon={ReceiptText} label="Cost" value={formatCurrency(analytics.cost.total)} changePct={analytics.cost.change_pct} />
                            <SummaryCard icon={PiggyBank} label="Profit" value={formatCurrency(analytics.profit.total)} changePct={analytics.profit.change_pct} />
                            <SummaryCard icon={Percent} label="Margin" value={`${analytics.margin.value.toFixed(1)}%`} changePct={analytics.margin.change_pct} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-amber-200 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue this month</h3>
                                <Chart
                                    type="line"
                                    height={280}
                                    series={[{ name: 'Revenue', data: revenueSeries.data }]}
                                    options={{
                                        chart: { toolbar: { show: false } },
                                        xaxis: { categories: revenueSeries.categories },
                                        colors: ['#b6723c'],
                                        stroke: { curve: 'smooth', width: 3 },
                                        dataLabels: { enabled: false },
                                    }}
                                />
                            </div>
                            <div className="bg-amber-200 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Top products by profit</h3>
                                <Chart
                                    type="bar"
                                    height={280}
                                    series={[{ name: 'Profit', data: profitSeries.data }]}
                                    options={{
                                        chart: { toolbar: { show: false } },
                                        xaxis: { categories: profitSeries.categories },
                                        colors: ['#667eea'],
                                        dataLabels: { enabled: false },
                                        plotOptions: { bar: { borderRadius: 6 } },
                                    }}
                                />
                            </div>
                        </div>

                        {analytics.underperforming_products.length > 0 && (
                            <div className="bg-amber-200 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Below target margin</h3>
                                <div className="table-responsive">
                                    <table className="w-full text-left bg-white rounded-xl overflow-hidden">
                                        <thead>
                                            <tr className="border-b-2 border-gray-300">
                                                <th className="p-3 text-gray-700">Product</th>
                                                <th className="p-3 text-gray-700">Actual Margin</th>
                                                <th className="p-3 text-gray-700">Target Margin</th>
                                                <th className="p-3 text-gray-700">Price Needed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analytics.underperforming_products.map((row) => (
                                                <tr key={row.product_id} className="border-b border-gray-200">
                                                    <td className="p-3 font-semibold text-gray-800">{row.product_name}</td>
                                                    <td className="p-3 text-red-600">{row.actual_margin.toFixed(1)}%</td>
                                                    <td className="p-3 text-gray-700">{row.target_margin.toFixed(1)}%</td>
                                                    <td className="p-3 text-gray-900">{formatCurrency(row.recommended_price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {showAddSale && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-amber-200 rounded-2xl p-8 max-w-md w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Record a Sale</h3>
                                <button onClick={() => setShowAddSale(false)} className="text-gray-700 hover:text-gray-900 text-2xl">×</button>
                            </div>

                            {saleSubmitError && (
                                <div className="bg-red-100 text-red-800 rounded-lg p-3 mb-4 text-sm">{saleSubmitError}</div>
                            )}

                            <form onSubmit={submitSale} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product</label>
                                    <select
                                        className="w-full rounded-lg p-2 border border-gray-300"
                                        value={saleForm.product}
                                        onChange={(e) => setSaleForm({ ...saleForm, product: e.target.value })}
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name} (${p.selling_price})</option>
                                        ))}
                                    </select>
                                    {saleErrors.product && <p className="text-red-600 text-xs mt-1">{saleErrors.product}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-lg p-2 border border-gray-300"
                                        value={saleForm.quantity}
                                        onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                                    />
                                    {saleErrors.quantity && <p className="text-red-600 text-xs mt-1">{saleErrors.quantity}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sale Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg p-2 border border-gray-300"
                                        value={saleForm.soldAt}
                                        onChange={(e) => setSaleForm({ ...saleForm, soldAt: e.target.value })}
                                    />
                                    {saleErrors.soldAt && <p className="text-red-600 text-xs mt-1">{saleErrors.soldAt}</p>}
                                </div>

                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" className="bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600" onClick={() => setShowAddSale(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving} className="bg-amber-500 text-white px-5 py-2 rounded-full hover:bg-amber-600 disabled:opacity-50">
                                        {saving ? 'Saving...' : 'Save Sale'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Dashboard;
