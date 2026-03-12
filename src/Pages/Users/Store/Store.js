import { useState, useEffect } from "react";
import axios from "axios";

import FilterSidebar from "../../../Components/Store/FilterSidebar";
import ProductGrid from "../../../Components/Store/ProductGrid";
import QuickViewModal from "./QuickViewModal";

import "./store.css";

const Store = () => {

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("all");

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:8000/api/products"
                );

                setProducts(res.data);

            } catch (error) {

                console.error("Error fetching products:", error);

            }

        };

        fetchProducts();

    }, []);

    const filteredProducts =
        category === "all"
            ? products
            : products.filter((p) => p.category === category);

    return (
        <div className="store-container">

            <FilterSidebar setCategory={setCategory} />

            <div className="store-content">

                <h2 className="store-title">Bike Parts Store</h2>
                <p className="store-offer">New Users Save 20%</p>

                <ProductGrid
                    products={filteredProducts}
                    openQuickView={setSelectedProduct}
                />

            </div>

            <QuickViewModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

        </div>
    );
};

export default Store;