import ProductCard from "./ProductCard";

const products = [
    {
        id: 1,
        name: "Disc Brake Set",
        price: 2500,
        oldPrice: 3000,
        rating: 4.5,
        image: "/images/brake.png"
    },
    {
        id: 2,
        name: "Bike Chain Kit",
        price: 1200,
        oldPrice: 1500,
        rating: 4.2,
        image: "/images/chain.png"
    },
    {
        id: 3,
        name: "Bike Chain Kit",
        price: 1200,
        oldPrice: 1500,
        rating: 4.2,
        image: "/images/chain.png"
    },
    {
        id: 4,
        name: "Bike Chain Kit",
        price: 1200,
        oldPrice: 1500,
        rating: 4.2,
        image: "/images/chain.png"
    },
    {
        id: 5,
        name: "Bike Chain Kit",
        price: 1200,
        oldPrice: 1500,
        rating: 4.2,
        image: "/images/chain.png"
    }
];

const ProductGrid = () => {
    return (
        <div className="product-grid">
            {products.map((item) => (
                <ProductCard key={item.id} product={item} />
            ))}
        </div>
    );
};

export default ProductGrid;
