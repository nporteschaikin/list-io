module.exports = function (error, request, response, next) {
  console.log(error.stack);
  return response.status(500).end();
}
