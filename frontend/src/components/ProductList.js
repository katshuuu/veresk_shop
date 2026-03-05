import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Используем правильный порт (5000 или 5001)
            const response = await axios.get('http://localhost:5001/api/products');
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке товаров: ' + err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Загрузка товаров...</div>;
    if (error) return <div className="error">❌ {error}</div>;

    return (
        <div className="product-list">
            <h2>Наши украшения ({products.length})</h2>
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            {/* Заглушка для изображения */}
                            <div className="image-placeholder">💎</div>
                        </div>
                        <h3>{product.name}</h3>
                        <p className="price">{product.price} ₽</p>
                        <p className="category">Категория: {product.category}</p>
                        <p className={`stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                        </p>
                        <p className="orders">📦 Заказов: {product.orders}</p>
                        <button 
                            className="buy-btn"
                            disabled={!product.inStock}
                        >
                            {product.inStock ? 'В корзину' : 'Нет в наличии'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;