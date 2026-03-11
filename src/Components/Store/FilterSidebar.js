import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const FilterSidebar = ({ setCategory }) => {
    return (
        <aside className="filter-sidebar">

            <h4 className="filter-title">
                <FontAwesomeIcon icon={faFilter} /> Refine By
            </h4>

            <div className="filter-group">
                <h5 className="filter-heading">Category</h5>

                <label className="filter-option">
                    <input type="radio" name="category" defaultChecked
                        onChange={() => setCategory("all")}
                    /> All Products
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("helmet")}
                    /> Helmet
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("gloves")}
                    /> Gloves
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("kneepads")}
                    /> Knee Pads
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("jackets")}
                    /> Jackets
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("raincoats")}
                    /> Raincoats
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("mobilestand")}
                    /> Mobile Stand
                </label>

                <label className="filter-option">
                    <input type="radio" name="category"
                        onChange={() => setCategory("usb")}
                    /> USB Receiver
                </label>

            </div>

        </aside>
    );
};

export default FilterSidebar;