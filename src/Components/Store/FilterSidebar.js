const FilterSidebar = () => {
    return (
        <aside className="filter-sidebar">
            <h4 className="filter-title">Refine By</h4>

            {/* Category Filter */}
            <div className="filter-group">
                <h5 className="filter-heading">Category</h5>

                <label className="filter-option">
                    <input type="checkbox" /> Brake Parts
                </label>

                <label className="filter-option">
                    <input type="checkbox" /> Engine Parts
                </label>

                <label className="filter-option">
                    <input type="checkbox" /> Tyres
                </label>

                <label className="filter-option">
                    <input type="checkbox" /> Chain & Sprocket
                </label>

                <label className="filter-option">
                    <input type="checkbox" /> Accessories
                </label>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
                <h5 className="filter-heading">Price</h5>

                <label className="filter-option">
                    <input type="radio" name="price" /> Under ₹500
                </label>

                <label className="filter-option">
                    <input type="radio" name="price" /> ₹500 – ₹2000
                </label>

                <label className="filter-option">
                    <input type="radio" name="price" /> Above ₹2000
                </label>
            </div>
        </aside>
    );
};

export default FilterSidebar;
