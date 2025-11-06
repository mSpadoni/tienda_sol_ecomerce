const procesarErrorAxios = (error) => {
  const status = error.response?.status || null;

  let messages = [];
  let codes = [];
  if (error.response?.data?.errors?.length) {
    messages = error.response.data.errors.map(e => e.message);
    codes = error.response.data.errors.map(e => e.code);
  }
  console.error("Error :", error.response?.data);
  const message = messages.length
    ? messages.join(", ")
    : error.response?.data?.message || error.response?.data.error||error.message

  const code = codes.length ? codes.join(", ") : null;

  console.error("Error Axios procesado:", { status, code, message });

  const customError = new Error(message);
  customError.status = status;
  customError.code = code;
  customError.errors = error.response?.data?.errors || null;
  return customError;
};

export default procesarErrorAxios;