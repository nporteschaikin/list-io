module.exports = function (schema, options) {
  var options = options || {};

  /*
   * Add reference to tags.
   */

  schema.add({
    tags: [{
      type: String
    }]
  });

  if (options.sourceAttribute) {
    var sourceAttribute = options.sourceAttribute;

    /*
     * If `from` attribute provided in
     * options, parse out.
     */

    schema.pre('save', function (next) {

      /*
       * Create new tags array.
       */

      var tags = [];

      /*
       * Get any hashtags from
       * source and add to array.
       */

      var regexp = /\#([a-zA-Z0-9]+)/g;
      var sourceValue = this[sourceAttribute];
      var match;
      while (match = regexp.exec(sourceValue)) {
        tags.push(match[1]);
      }

      /*
       * Set tags.
       */

      this.tags = tags;

      /*
       * Move on.
       */

      return next();

    });
  }

}
