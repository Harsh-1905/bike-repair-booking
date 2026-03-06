const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            {/* Image */}
            <div className="product-image">
                <img src={product.image} alt={product.name} />
            </div>

            {/* Info */}
            <div className="product-info">
                <h4 className="product-name">{product.name}</h4>

                <p className="product-price">
                    ₹{product.price}
                    {product.oldPrice && (
                        <span className="old-price"> ₹{product.oldPrice}</span>
                    )}
                </p>

                <p className="product-rating">⭐ {product.rating}</p>
            </div>

            {/* Action */}
            <button className="add-to-cart">Add to Cart</button>
        </div>
    );
};

export default ProductCard;
