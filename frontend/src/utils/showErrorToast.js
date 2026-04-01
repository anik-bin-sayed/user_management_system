import { toast } from "react-toastify";

export const showErrorToast = (error) => {
  if (!error?.data) {
    toast.error("Something went wrong");
    return;
  }

  const errors = error.data;

  Object.keys(errors).forEach((key) => {
    const message = errors[key];

    if (Array.isArray(message)) {
      message.forEach((msg) => toast.error(msg));
    } else {
      toast.error(message);
    }
  });
};
