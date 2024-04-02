const errorHandler = () => {
  const status = error.status || 500; // Use a custom status code if provided
  const message = error.message || 'Something went wrong';

  res.status(status).json({ error: message });
};

export { errorHandler };
