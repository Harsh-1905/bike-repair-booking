import { useCart } from "./Cartcontext";
import { showSuccess } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import "./quickview.css";

const QuickViewModal = ({ product, onClose }) => {

    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product);
        showSuccess(`${product.name} added to cart!`);
        // Close modal and redirect to cart
        onClose();
        setTimeout(() => {
            navigate("/cart");
        }, 1000); // Small delay to show the success message
    };

    return (
        <div className="quickview-overlay">

            <div className="quickview-modal">

                <button className="close-btn" onClick={onClose}>✕</button>

                <div className="quickview-content">

                    <div className="quickview-image">
                        <img
                            src={`http://localhost:8000/uploads/productimages/${product.image}`}
                            alt={product.name}
                        />
                    </div>

                    <div className="quickview-info">

                        <h2>{product.name}</h2>

                        <p className="quickview-price">
                            ₹{product.price}
                            {product.oldPrice && (
                                <span> ₹{product.oldPrice}</span>
                            )}
                        </p>

                        <p className="quickview-rating">
                            ⭐ {product.rating}
                        </p>

                        <p className="quickview-desc">
                            {product.description || "Premium bike accessory built for durability and performance."}
                        </p>

                        <button className="quickview-cart" onClick={handleAddToCart}>
                            Add To Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default QuickViewModal;