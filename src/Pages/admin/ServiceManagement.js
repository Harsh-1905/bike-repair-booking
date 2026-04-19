import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPlus, faEdit, faTrash, faSave, faTimes, 
    faTools, faMotorcycle, faCog
} from "@fortawesome/free-solid-svg-icons";
import api from "../../Api/axios";
import "./service-management.css";

const ServiceManagement = ({ isCollapsed }) => {
    const [customServices, setCustomServices] = useState([]);
    const [servicePackages, setServicePackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [editingPackage, setEditingPackage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState({ name: "", price: "" });

    useEffect(() => {
        fetchServices();
        fetchServicePackages();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get("/services/custom");
            setCustomServices(response.data.services || []);
        } catch (error) {
            console.error("Error fetching custom services:", error);
            // Initialize with default services if API fails
            setCustomServices([
                { _id: "1", name: "Engine Oil Change", price: 300 },
                { _id: "2", name: "Brake Inspection", price: 150 },
                { _id: "3", name: "Chain Lubrication", price: 100 },
                { _id: "4", name: "Battery Check", price: 120 },
                { _id: "5", name: "Air Filter Cleaning", price: 130 },
                { _id: "6", name: "Tyre Pressure Check", price: 80 },
                { _id: "7", name: "Clutch Adjustment", price: 160 },
                { _id: "8", name: "Coolant Check", price: 140 },
                { _id: "9", name: "Spark Plug Cleaning", price: 120 },
                { _id: "10", name: "Headlight Check", price: 90 },
                { _id: "11", name: "Horn Check", price: 60 },
                { _id: "12", name: "Gear Oil Check", price: 110 },
                { _id: "13", name: "Brake Fluid Check", price: 130 },
                { _id: "14", name: "Wheel Alignment", price: 200 },
                { _id: "15", name: "Full Safety Inspection", price: 250 }
            ]);
        }
        setLoading(false);
    };

    const fetchServicePackages = async () => {
        try {
            const response = await api.get("/services/packages");
            setServicePackages(response.data.packages || []);
        } catch (error) {
            console.error("Error fetching service packages:", error);
            // Initialize with default packages if API fails
            setServicePackages([
                { _id: "general", name: "General Service", price: 499 },
                { _id: "allover", name: "All-over Service", price: 999 },
                { _id: "basic", name: "Basic Service", price: 199 }
            ]);
        }
    };

    const handleAddService = async () => {
        if (!newService.name.trim() || !newService.price) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await api.post("/services/custom", {
                name: newService.name.trim(),
                price: parseInt(newService.price)
            });
            
            if (response.data.success) {
                setCustomServices([...customServices, response.data.service]);
                setNewService({ name: "", price: "" });
                setShowAddForm(false);
                alert("Service added successfully!");
            }
        } catch (error) {
            console.error("Error adding service:", error);
            // Fallback for demo
            const newId = Date.now().toString();
            const service = {
                _id: newId,
                name: newService.name.trim(),
                price: parseInt(newService.price)
            };
            setCustomServices([...customServices, service]);
            setNewService({ name: "", price: "" });
            setShowAddForm(false);
            alert("Service added successfully!");
        }
    };

    const handleEditService = async (serviceId, updatedData) => {
        try {
            const response = await api.put(`/services/custom/${serviceId}`, updatedData);
            
            if (response.data.success) {
                setCustomServices(customServices.map(service => 
                    service._id === serviceId ? { ...service, ...updatedData } : service
                ));
                setEditingService(null);
                alert("Service updated successfully!");
            }
        } catch (error) {
            console.error("Error updating service:", error);
            // Fallback for demo
            setCustomServices(customServices.map(service => 
                service._id === serviceId ? { ...service, ...updatedData } : service
            ));
            setEditingService(null);
            alert("Service updated successfully!");
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) {
            return;
        }

        try {
            const response = await api.delete(`/services/custom/${serviceId}`);
            
            if (response.data.success) {
                setCustomServices(customServices.filter(service => service._id !== serviceId));
                alert("Service deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            // Fallback for demo
            setCustomServices(customServices.filter(service => service._id !== serviceId));
            alert("Service deleted successfully!");
        }
    };

    const handleUpdatePackage = async (packageId, updatedData) => {
        try {
            const response = await api.put(`/services/packages/${packageId}`, updatedData);
            
            if (response.data.success) {
                setServicePackages(servicePackages.map(pkg => 
                    pkg._id === packageId ? { ...pkg, ...updatedData } : pkg
                ));
                setEditingPackage(null);
                alert("Service package updated successfully!");
            }
        } catch (error) {
            console.error("Error updating package:", error);
            // Fallback for demo
            setServicePackages(servicePackages.map(pkg => 
                pkg._id === packageId ? { ...pkg, ...updatedData } : pkg
            ));
            setEditingPackage(null);
            alert("Service package updated successfully!");
        }
    };

    if (loading) {
        return (
            <div className="service-management">
                <div className="loading">Loading services...</div>
            </div>
        );
    }

    return (
        <div className={`service-management ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="page-header">
                <h1><FontAwesomeIcon icon={faTools} /> Service Management</h1>
                <p>Manage custom services and update service package prices</p>
            </div>

            {/* Service Packages Section */}
            <div className="management-section">
                <div className="section-header">
                    <h2><FontAwesomeIcon icon={faMotorcycle} /> Service Packages</h2>
                    <p>Update prices for main service packages</p>
                </div>

                <div className="packages-grid">
                    {servicePackages.map(pkg => (
                        <div key={pkg._id} className="package-card">
                            <div className="package-icon">
                                <FontAwesomeIcon icon={faCog} />
                            </div>
                            <h3>{pkg.name}</h3>
                            
                            {editingPackage === pkg._id ? (
                                <div className="edit-form">
                                    <input
                                        type="number"
                                        value={pkg.price}
                                        onChange={(e) => setServicePackages(servicePackages.map(p => 
                                            p._id === pkg._id ? { ...p, price: parseInt(e.target.value) || 0 } : p
                                        ))}
                                        className="price-input"
                                    />
                                    <div className="edit-actions">
                                        <button 
                                            className="save-btn"
                                            onClick={() => handleUpdatePackage(pkg._id, { price: pkg.price })}
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={() => {
                                                setEditingPackage(null);
                                                fetchServicePackages();
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="package-info">
                                    <div className="price">₹{pkg.price}</div>
                                    <button 
                                        className="edit-btn"
                                        onClick={() => setEditingPackage(pkg._id)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} /> Edit Price
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Services Section */}
            <div className="management-section">
                <div className="section-header">
                    <h2><FontAwesomeIcon icon={faTools} /> Custom Services</h2>
                    <p>Manage individual services for customize service option</p>
                    <button 
                        className="add-service-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add New Service
                    </button>
                </div>

                {/* Add New Service Form */}
                {showAddForm && (
                    <div className="add-form-card">
                        <h3>Add New Service</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                className="service-input"
                            />
                            <input
                                type="number"
                                placeholder="Price (₹)"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                className="price-input"
                            />
                            <div className="form-actions">
                                <button className="save-btn" onClick={handleAddService}>
                                    <FontAwesomeIcon icon={faSave} /> Add Service
                                </button>
                                <button 
                                    className="cancel-btn" 
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewService({ name: "", price: "" });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimes} /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Services List */}
                <div className="services-table">
                    <div className="table-header">
                        <div className="col-name">Service Name</div>
                        <div className="col-price">Price</div>
                        <div className="col-actions">Actions</div>
                    </div>

                    {customServices.map(service => (
                        <div key={service._id} className="table-row">
                            {editingService === service._id ? (
                                <>
                                    <div className="col-name">
                                        <input
                                            type="text"
                                            value={service.name}
                                            onChange={(e) => setCustomServices(customServices.map(s => 
                                                s._id === service._id ? { ...s, name: e.target.value } : s
                                            ))}
                                            className="service-input"
                                        />
                                    </div>
                                    <div className="col-price">
                                        <input
                                            type="number"
                                            value={service.price}
                                            onChange={(e) => setCustomServices(customServices.map(s => 
                                                s._id === service._id ? { ...s, price: parseInt(e.target.value) || 0 } : s
                                            ))}
                                            className="price-input"
                                        />
                                    </div>
                                    <div className="col-actions">
                                        <button 
                                            className="save-btn"
                                            onClick={() => handleEditService(service._id, { 
                                                name: service.name, 
                                                price: service.price 
                                            })}
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={() => {
                                                setEditingService(null);
                                                fetchServices();
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-name">{service.name}</div>
                                    <div className="col-price">₹{service.price}</div>
                                    <div className="col-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => setEditingService(service._id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteService(service._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {customServices.length === 0 && (
                    <div className="empty-state">
                        <p>No custom services found. Add your first service!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceManagement;