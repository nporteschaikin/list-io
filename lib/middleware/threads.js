var Models = require('./../models');

exports.findById = function (request, response, next) {
  if (!request.post) return next();
  request.thread = request.post.threads.id(request.params.thread);
  return next();
}

exports.create = function (request, response, next) {
  if (!request.post) return next();
  var post = request.post;
  var params = request.body;
  var user = request.sessionUser;

  /*
   * Generate thread.
   */

  var thread = post.threads.create({
    user: user,
    content: params.content,
    isPrivate: !!params.isPrivate
  });

  /*
   * Push to posts array.
   */

  post.threads.push(thread);

  /*
   * Save.
   */

  return post.save(function (error) {
    if (error) return next(error);

    /*
     * Create noficiation.
     */

    Models.ThreadNotification.create({
      actor: user,
      post: post,
      thread: thread,
      action: 'create',
      recipients: [ post.user ],
      alert: (user.displayName + ' created a thread in "' + post.title + '"')
    });

    request.thread = thread;
    return next();

  });

}
