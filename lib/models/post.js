var mongo = require('./../mongo')
var utils = require('./../utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    }
  }

});

var Thread = new Schema({

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    type: String,
    required: true
  },

  messages: [ Message ],

  isPrivate: {
    type: Boolean,
    required: true
  },

  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    }
  }

});

var Post = new Schema({

  location: {
    type: [Number],
    index: '2dsphere'
  },

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  coverPhotoUrl: {
    type: String
  },

  threads: [ Thread ],

  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    }
  },

  /*
   * Placemark schema.
   */

  placemark: {

    neighborhood: {
      type: String
    },

    locality: {
      type: String
    },

    sublocality: {
      type: String
    },

    administrativeAreaLevel3: {
      type: String
    },

    administrativeAreaLevel2: {
      type: String
    },

    administrativeAreaLevel1: {
      type: String
    },

    country: {
      type: String
    }

  },

  /*
   * Event schema.
   */

  event: {

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: false
    },

    location: {
      type: String,
      required: true
    }

  }

});

/*
 * Add text indexex.
 */

Post.index({
  title: 'text',
  content: 'text',
  'placemark.neighborhood': 'text',
  'placemark.locality': 'text',
  'placemark.sublocality': 'text'
});

/*
 * If a cover photo exists, save it.
 */

Post.virtual('coverPhoto').set(function (coverPhoto) {
  this.coverPhotoBase64String = coverPhoto;
});

Post.pre('save', function (next) {
  var self = this;
  if (self.coverPhotoBase64String) {
    return utils.s3.upload(self.coverPhotoBase64String, 'jpg', function (error, url) {
      self.set({coverPhotoUrl: url});
      self.coverPhotoBase64String = null;
      return next();
    });
  }
  return next();
});

/*
 * Add placemark.
 */

Post.pre('save', function (next) {
  var self = this;
  var location = self.location;
  return utils.geocoder.reverse(location[1], location[0], function (error, data) {
    self.set({placemark: data});
    return next();
  });
})

module.exports = mongo.model('Post', Post);
