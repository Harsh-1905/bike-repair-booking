import React, { useState } from "react";
import axios from "axios";
import { showSuccess, showError } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./add-product.css";

const AddProduct = ({ isCollapsed }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        oldPrice: "",
        category: "",
        rating: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = [
        "helmet",
        "gloves",
        "kneepads",
        "jackets",
        "raincoats",
        "mobilestand",
        "usb",
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            showError("Please select a product image");
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("oldPrice", formData.oldPrice || "");
            formDataToSend.append("category", formData.category);
            formDataToSend.append("rating", formData.rating);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("image", image);

            await axios.post(
                "http://localhost:8000/api/products/add",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            showSuccess("Product added successfully!");

            // Reset form
            setFormData({
                name: "",
                price: "",
                oldPrice: "",
                category: "",
                rating: "",
                description: "",
            });
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error adding product:", error);
            showError(error.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="add-product-container"
            style={{
                marginLeft: isCollapsed ? "80px" : "250px",
                transition: "margin-left 0.3s ease"
            }}
        >
            <div className="add-product-header">
                <h2>
                    <FontAwesomeIcon icon={faPlus} /> Add New Product
                </h2>
            </div>

            <div className="add-product-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Old Price (₹)</label>
                            <input
                                type="number"
                                name="oldPrice"
                                value={formData.oldPrice}
                                onChange={handleChange}
                                placeholder="Enter old price (optional)"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Rating *</label>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="Enter rating (0-5)"
                                min="0"
                                max="5"
                                step="0.1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Image *</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            <label htmlFor="image-upload" className="upload-label">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <FontAwesomeIcon icon={faUpload} />
                                        <p>Click to upload image</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
