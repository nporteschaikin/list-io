module.exports = function (error, request, response, next) {
  console.log(error);
  return response.status(500).end();
}
