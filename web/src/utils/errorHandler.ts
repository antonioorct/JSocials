import toast from "../components/Toast";

interface IError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export default function handleError(err: IError): void {
  if (typeof err === "string") toast(err, "error");
  else if (err.response?.data?.error) toast(err.response.data.error, "error");
  else if (err.response?.data && typeof err.response.data === "string")
    toast(err.response.data, "error");
  else if (err.message) toast(err.message, "error");
  else toast("An unknown error has occurred", "error");
}
