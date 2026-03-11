import ProductCard from "./ProductCard";

const ProductGrid = ({ products, openQuickView }) => {
    return (
        <div className="product-grid">
            {products.map((item) => (
                <ProductCard
                    key={item._id}
                    product={item}
                    openQuickView={openQuickView}
                />
            ))}
        </div>
    );
};

export default ProductGrid;