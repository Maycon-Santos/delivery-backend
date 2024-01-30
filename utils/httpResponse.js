export function sendError(res, statusCode, message, errorType) {
  res.status(statusCode);
  res.send({
    success: false,
    type: errorType,
    message,
  });
}
