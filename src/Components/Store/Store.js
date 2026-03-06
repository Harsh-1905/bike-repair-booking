import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import "./store.css";

const Store = () => {
    return (
        <div className="store-container">
            <FilterSidebar />
            <div className="store-content">
                <h2 className="store-title">Bike Parts Store</h2>
                <p className="store-offer">New Users Save 20%</p>
                <ProductGrid />
            </div>
        </div>
    );
};

export default Store;
