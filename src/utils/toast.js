import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (msg) => {
    toast.success(msg, {
        position: "top-left",
        autoClose: 3000, // 3 sec
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const showError = (msg) => {
    toast.error(msg, {
        position: "top-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};


export const showInfo = (msg) => {
    toast.info(msg, {
        position: "top-left",
        autoClose: 2000,
    });
};