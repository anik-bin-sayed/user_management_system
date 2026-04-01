import { toast } from "react-toastify";

export const showSuccessToast = (message = "Update successful!") => {
  toast.success(message);
};
