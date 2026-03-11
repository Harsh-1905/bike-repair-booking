import { useCart } from "../../Pages/Users/Store/Cartcontext";
import { showSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, openQuickView }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart(product);
        showSuccess(`${product.name} added to cart!`);
        // Redirect to cart page after adding item
        setTimeout(() => {
            navigate("/cart");
        }, 1000); // Small delay to show the success message
    };

    return (
        <div className="product-card">

            <div className="product-image">
                <img
                    src={`http://localhost:8000/uploads/productimages/${product.image}`}
                    alt={product.name}
                />
            </div>

            <div className="product-info">

                <h4 className="product-name">{product.name}</h4>

                <p className="product-price">
                    ₹{product.price}
                    {product.oldPrice && (
                        <span className="old-price"> ₹{product.oldPrice}</span>
                    )}
                </p>

                <p className="product-rating">⭐ {product.rating}</p>

                <p
                    className="view-details"
                    onClick={() => openQuickView(product)}
                >
                    View Details
                </p>

            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>

        </div>
    );
};

export default ProductCard;