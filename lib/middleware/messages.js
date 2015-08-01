exports.create = function (request, response, next) {
  if (!request.post || !request.thread) return next();
  var post = request.post;
  var thread = request.thread;
  var user = request.sessionUser;
  var params = request.body;

  /*
   * Generate message.
   */

  var message = thread.messages.create({
    user: user,
    content: params.content,
    isPrivate: !!params.isPrivate
  });

  /*
   * Push to posts array.
   */

  thread.messages.push(thread);

  /*
   * Save.
   */

  return post.save(function (error) {
    if (error) return next(error);
    request.message = message;
    return next();
  });

}
