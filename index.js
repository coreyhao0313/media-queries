var media = function () {
  this.setter =
    {
      query   : [], // ['(max-width: 575.98px)'],
      main    : [],
      callback: [], // [new Function]
      active  : {
        query: []
      }
    };
  this.appearing = {
    setter : {
      query     : [], // ['(max-width: 575.98px)'],
      main      : [],
      callback  : [], // [new Function] It's for remove addListener
      keys_group: [], // comment and dom's key
      active    : {
        query: []
      }
    },
    comment: {
      dom: [], // comment node
      key: []
    },
    entity : {
      dom: [], // entity node
      key: []
    }
  };
  this._id = 0;

  this.setId = function (id) {
    if (id === undefined) {
      ++this._id;
    } else {
      this._id = id;
    }
  }
  this.getIdBy16 = function () {
    return (this._id + Math.pow(10, 8)).toString(16);
  }
}

media.prototype.set = function (querystring, callback, isNotMatchesOnly) {
  if (typeof querystring !== 'string') {
    console.error('querystring must be type of string');
    return;
  }
  var self = this;

  var index = -1;
  this.setter.query
    .map(function (querystringRow, i) {
      if (self.matchStr(querystringRow, querystring)) {
        index = i;
      }
    });

  if (index > -1) {
    console.error('Failed to set "' + querystring + '" querystring, because it was existing');
    return;
  }
  if (typeof callback !== 'function') {
    console.error('callback isn\'t a function');
    return;
  }

  this.setter.query.push(querystring);

  var wrapcallback = null;

  if (isNotMatchesOnly) {
    wrapcallback = function (event) {
      if (event.matches) {
        self.setter.active.query.push(querystring)
      } else {
        if (self.setter.active.query.indexOf(querystring) > -1) {
          self.setter.active.query.splice(self.setter.active.query.indexOf(querystring), 1);
        }
      }
      callback(event, self);
    }
  } else {
    wrapcallback = function (event) {
      if (event.matches) {
        self.setter.active.query.push(querystring)
        callback(event, self);
      } else {
        if (self.setter.active.query.indexOf(querystring) > -1) {
          self.setter.active.query.splice(self.setter.active.query.indexOf(querystring), 1);
        }
      }
    }
  }
  this.setter.callback.push(wrapcallback);
  this.setter.main.push(window.matchMedia(this.setter.query[this.setter.query.length - 1]));
  this.setter.main[this.setter.main.length - 1]
    .addListener(this.setter.callback[this.setter.callback.length - 1]); // binding

  return this;
}


media.prototype.remove = function (querystring) {
  if (typeof querystring !== 'string') {
    console.error('querystring must be type of string');
    return;
  }
  var self = this;

  var index = -1;
  this.setter.query
    .map(function (querystringRow, i) {
      if (self.matchStr(querystringRow, querystring)) {
        index = i;
      }
    });

  if (index > -1) {
    this.setter.main[index].removeListener(this.setter.callback[index]);
    this.setter.query.splice(index, 1);
    this.setter.main.splice(index, 1);
    this.setter.callback.splice(index, 1);
  } else {
    console.warn('"' + querystring + '" doesn\'t exist');
  }

  return this;
}


media.prototype.getMedia = function (querystring, callback) {
  if (typeof callback === 'function') {
    callback(window.matchMedia(querystring), this);
  } else {
    console.warn('return string that lack of callback');
    return window.matchMedia(querystring);
  }

  return this;
}


media.prototype.getStatus = function (callback) {
  var result = {
    querystrings       : this.setter.query.slice(),
    active_querystrings: this.setter.active.query.slice()
  };

  if (typeof callback === 'function') {
    callback(result, this);
  } else {
    console.warn('return string that lack of callback');
    return result;
  }

  return this;
}


media.prototype.getAppearingStatus = function (callback) {
  var result = {
    querystrings       : this.appearing.setter.query.slice(),
    active_querystrings: this.appearing.setter.active.query.slice(),
    comments           : this.appearing.comment.dom,
    doms               : this.appearing.entity.dom
  };

  if (typeof callback === 'function') {
    callback(result, this);
  } else {
    console.warn('return string that lack of callback');
    return result;
  }

  return this;
}


media.prototype.trigger = function (querystring) {
  var querystrings;
  var self = this;

  if (Array.isArray(querystring) && querystring.length) {
    querystrings = querystring;
    querystring = querystrings.shift();
  }

  var index = -1;
  this.setter.query
    .map(function (querystringRow, i) {
      if (self.matchStr(querystringRow, querystring)) {
        index = i;
      }
    });

  if (index > -1) {
    var event = new Event("change");
    var mediaQueryLists = this.setter.main[index];
    if ("custom" in mediaQueryLists) {
      event.media = "media" in mediaQueryLists.custom ? mediaQueryLists.custom.media : mediaQueryLists.media;
      event.matches = "matches" in mediaQueryLists.custom ? mediaQueryLists.custom.matches : mediaQueryLists.matches;
    } else {
      event.media = mediaQueryLists.media;
      event.matches = mediaQueryLists.matches;
    }
    event.srcElement = mediaQueryLists;
    event.target = mediaQueryLists;

    this.setter.callback[index](event, this);
  }

  if (querystrings && querystrings.length) {
    this.trigger(querystrings);
  }

  return this;
}


media.prototype.triggerAppearingWithMedia = function (querystring) {
  var _self = Object.assign(media.prototype, this);
  _self.setter = this.appearing.setter;

  this.trigger.apply(_self, [querystring]);

  return this;
}


media.prototype.matchStr = function (aStr, bStr) {
  var aArr = [];
  var bArr = [];
  var aRefArr = [];
  var bRefArr = [];

  for (var index = 0; index < aStr.length; index++) {
    aArr.push(aStr[index]);
    aRefArr.push(aStr[index]);
  }
  for (var index = 0; index < bStr.length; index++) {
    bArr.push(bStr[index]);
    bRefArr.push(aStr[index]);
  }

  aRefArr.map(function (word) {
    var index = bArr.indexOf(word);
    if (index > -1) {
      bArr.splice(index, 1);
    }
  });
  var bQuiteMatch = bArr.length === 0;

  bArr = bRefArr;

  bRefArr.map(function (word) {
    var index = aArr.indexOf(word);
    if (index > -1) {
      aArr.splice(index, 1);
    }
  });
  var aQuiteMatch = aArr.length === 0;

  return bQuiteMatch && aQuiteMatch;
}


media.prototype.setAppearing = function (querystring, dom) {
  if (typeof querystring !== 'string') {
    console.error('querystring must be type of string');
    return;
  }
  var self = this;

  var index = -1;
  this.appearing.setter.query
    .map(function (querystringRow, i) {
      if (self.matchStr(querystringRow, querystring)) {
        index = i;
      }
    });

  if (index > -1) {
    console.error('Failed to set "' + querystring + '" querystring, because it was existing');
    return;
  }

  var keys = [];

  if (Array.isArray(dom)) {
    var doms = dom;
    doms
      .filter(function (dom) {
        return dom;
      })
      .map(function (dom) {
        self.setId();

        var key = Object.keys(dom.dataset)
          .filter(function (key) {
            return /^c-\w+/.test(key);
          })[0] || 'c-' + self.getIdBy16();

        dom.dataset[key] = [];
        self.appearing.entity.dom.push(dom);
        self.appearing.entity.key.push(key);


        var comment = document.createComment("");

        self.appearing.comment.key.push(key);
        self.appearing.comment.dom.push(comment);

        keys.push(key);
      });
  } else {
    self.setId();

    var key = Object.keys(dom.dataset)
      .filter(function (key) {
        return /^c-\w+/.test(key);
      })[0] || 'c-' + self.getIdBy16();

    dom.dataset[key] = [];
    this.appearing.entity.dom.push(dom);
    this.appearing.entity.key.push(key);

    var comment = document.createComment("");

    this.appearing.comment.key.push(key);
    this.appearing.comment.dom.push(comment);

    keys.push(key);
  }

  this.appearing.setter.keys_group.push(keys);
  this.appearing.setter.query.push(querystring);

  this.appearing.setter.callback.push(function (event) {
    self.appearingEffect.apply(self, [querystring, event.matches]);
  });
  this.appearing.setter.main.push(window.matchMedia(this.appearing.setter.query[this.appearing.setter.query.length - 1]));
  this.appearing.setter.main[this.appearing.setter.main.length - 1]
    .addListener(this.appearing.setter.callback[this.appearing.setter.callback.length - 1]); // binding

  return this;
}


media.prototype.removeAppearing = function (querystring, domMethod) {
  var self = this;
  var querystrings;

  if (Array.isArray(querystring) && querystring.length) {
    querystrings = querystring;
    querystring = querystrings.shift();
  }

  var index = -1;
  this.appearing.setter.query
    .map(function (querystringRow, i) {
      if (self.matchStr(querystringRow, querystring)) {
        index = i;
      }
    });

  if (index > -1) {
    switch (domMethod) {
      case 'appearing':
        this.appearing.setter.main[index].custom = { matches: true };
        this.triggerAppearingWithMedia(querystring);
        break;

      case 'remove':
        this.appearing.setter.main[index].custom = { matches: false };
        this.triggerAppearingWithMedia(querystring);
        break;

      default:
        this.triggerAppearingWithMedia(querystring);
        break;
    }

    this.appearing.setter.main[index].removeListener(this.appearing.setter.callback[index]);
    this.appearing.setter.query.splice(index, 1);
    this.appearing.setter.main.splice(index, 1);
    this.appearing.setter.callback.splice(index, 1);

    var keys = self.appearing.setter.keys_group[index];


    keys.map(function (key) {
      var entity_index = self.appearing.entity.key.indexOf(key);
      var comment_index = self.appearing.comment.key.indexOf(key);

      if (entity_index > -1) {
        self.appearing.entity.key.splice(entity_index, 1);
        self.appearing.entity.dom.splice(entity_index, 1);
      }
      if (comment_index > -1) {
        self.appearing.comment.key.splice(comment_index, 1);
        self.appearing.comment.dom.splice(comment_index, 1);
      }
    });

    this.appearing.setter.keys_group.splice(index, 1);
  } else {
    console.warn('"' + querystring + '" doesn\'t exist');
  }

  if (querystrings && querystrings.length) {
    this.removeAppearing(querystrings, domMethod);
  }

  return this;
}


media.prototype.appearingEffect = function (querystring, appearing) {
  var self = this;
  var querystrings;

  if (Array.isArray(querystring) && querystring.length) {
    querystrings = querystring;
    querystring = querystrings.shift();
  }

  var index = -1;
  this.appearing.setter.query
    .map(function (querystringRow, i) {
      if (self.matchStr(querystringRow, querystring)) {
        index = i;
      }
    });

  var keys = self.appearing.setter.keys_group[index];

  if (keys.length === 0) {
    return this;
  }

  if (appearing) {

    self.appearing.setter.active.query.push(querystring);

    keys.map(function (key) {
      var comment_index = self.appearing.comment.key.indexOf(key);
      var entity_index = self.appearing.entity.key.indexOf(key);

      if (entity_index > -1 && comment_index > -1) {
        if (self.appearing.comment.dom[comment_index].parentNode && self.appearing.entity.dom[entity_index]) {
          self.appearing.comment.dom[comment_index]
            .parentNode.insertBefore(self.appearing.entity.dom[entity_index], self.appearing.comment.dom[comment_index]);
          self.appearing.comment.dom[comment_index].remove();
        }
      }
    });

  } else {

    if (self.appearing.setter.active.query.indexOf(querystring) > -1) {
      self.appearing.setter.active.query.splice(self.appearing.setter.active.query.indexOf(querystring), 1);
    }

    this.fundIndexByQuerystring(self.appearing.setter.active.query, self.appearing.setter.query, function (_index) {
        keys = keys.filter(function (key) {
          return self.appearing.setter.keys_group[_index].indexOf(key) === -1;
        });
      })

    keys.map(function (key) {
      var entity_index = self.appearing.entity.key.indexOf(key);
      var comment_index = self.appearing.comment.key.indexOf(key);

      if (entity_index > -1 && comment_index > -1) {
        if (self.appearing.entity.dom[entity_index].parentNode && self.appearing.comment.dom[comment_index]) {
          self.appearing.entity.dom[entity_index]
            .parentNode.insertBefore(self.appearing.comment.dom[comment_index], self.appearing.entity.dom[entity_index]);
          self.appearing.entity.dom[entity_index].remove();
        }
      }
    });
  }

  if (querystrings && querystrings.length) {
    this.appearingEffect(querystrings, appearing);
  }

  return this;
}


media.prototype.fundIndexByQuerystring = function(querystrings, in_querystrings, callback){
  var self = this;

  querystrings
      .map(function (_querystring) {
        var index = -1;
        in_querystrings
          .map(function (querystringRow, i) {
            if (self.matchStr(querystringRow, _querystring)) {
              index = i;
            }
          });
        return index;
      })
      .filter(function (_index) {
        return _index > -1;
      })
      .map(callback);
}