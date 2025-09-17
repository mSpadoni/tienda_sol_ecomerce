export default function formatearErroresZod(error) {
  return error.errors.reduce((acc, err) => {
    const field = err.path.join(".");
    acc[field] = err.message;
    return acc;
  }, {});
}
