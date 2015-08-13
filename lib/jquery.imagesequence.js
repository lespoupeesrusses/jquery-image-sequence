var ImageSequence = function (target, options) {

  target.imagesequence = this;

  this.target = target;
  this.src = options.src;
  this.width = options.width;
  this.height = options.height;
  this.currentFrame = 0;
  this.image = new Image();
  this.step = 1;
  this.loop = false;
  this.running = false;
  if (options.loop) {
    this.loop = true;
  }
  this.autoplay = false;
  if (options.autoplay) {
    this.autoplay = true;
  }
  if (options.rewind) {
    this.step = -1;
  }
  this.shouldPlay = this.autoplay;

  this.afterAnimation = false;
  if(options.afterAnimation !== undefined){
    this.afterAnimation = true;
    var animationEnded = options.afterAnimation;
  }

  this.path = options.path;
  this.indexTo = 0;
  if (options.indexTo) {
    this.indexTo = options.indexTo;
  }
  this.indexFrom = 0;
  if (options.indexFrom) {
    this.indexFrom = options.indexFrom;
  }
  this.extension = options.extension;
  this.images = [];
  this.mode = 'sprite';
  if(options.path) {
    this.mode = 'sequence';
  }

  var _this = this;

  this.init = function () {
    if(_this.mode === 'sequence') {
      _this.preloader();
    } else {
      _this.image.src = _this.src;
      _this.target.html(_this.image);
    }
    _this.target.css('overflow','hidden');
  };

  this.run = function () {
    _this.running = true;
    setTimeout(function () {
      if(_this.shouldPlay){
        _this.nextFrame();
        _this.run();
      }
    }, 40);
  };

  this.preloader = function () {
    for(var i = _this.indexFrom; i <= _this.indexTo; i++) {
      var img = new Image();
      var imageName = _this.path + '/' + i + _this.extension;
      img.src = imageName;
      _this.images.push(img);
    }

  };

  this.play = function () {
    _this.step = 1;
    _this.shouldPlay = true;
    if(_this.running === false) {
      _this.run();
    }
  };

  this.pause = function () {
    _this.step = 0;
  };

  this.rewind = function () {
    _this.step = -1;
    _this.shouldPlay = true;
    if(_this.running === false) {
      _this.run();
    }
  };

  this.drawCurrentFrame = function () {

    if(_this.mode === 'sequence') {

      var counter = _this.currentFrame;

      $(_this.target.selector).css({
        'background' : 'url(' + _this.images[counter].src + ') no-repeat center center',
        'background-size' : 'cover'
      });
    } else {

      var targetWidth = _this.target.width();
      var targetHeight = _this.target.height();

      var scaleX = targetWidth / _this.width;
      var scaleY = targetHeight / _this.height;
      var scale = Math.max(scaleX, scaleY);

      var frameWidth = _this.width * scale;
      var frameHeight = _this.height * scale;

      var x = (targetWidth - frameWidth) / 2;
      var y = (targetHeight - frameHeight) / 2;

      // Animation
      x -= _this.currentFrame * frameWidth;

      $(_this.image).css({
        'transform' : "translate3d(" + x + "px,"+ y +"px,0) scale(" + scale + ", " + scale + ")",
        'transform-origin' : 'left top'
      });
    }

  };

  /*
  Not necessarily 1, 2, 3...
  Can be 8, 7, 6...
  Could also be 0, 5, 10, 15...
  */
  this.nextFrame = function () {
    _this.currentFrame = _this.currentFrame + _this.step;
    if (_this.currentFrame >= _this.countFrames()) {
      if(_this.afterAnimation){
        animationEnded();
      }
      // On the right, end of sequence
      if (_this.loop) {
        _this.currentFrame -= _this.countFrames();
      } else {
        _this.currentFrame = _this.countFrames() - 1;
        _this.shouldPlay = false;
        _this.running = false;
      }
    } else if (_this.currentFrame < 0) {
      // On the left, beginning of sequence
      if(_this.loop){
        _this.currentFrame += _this.countFrames();
      } else {
        _this.currentFrame = 0;
        _this.shouldPlay = false;
        _this.running = false;
      }
    }
    _this.drawCurrentFrame();
  };

  this.countFrames = function () {
    if(_this.mode === 'sequence') {
      return _this.indexTo - _this.indexFrom;
    } else {
      return _this.image.naturalWidth / _this.width;
    }
  };

  this.init();
  if(_this.autoplay){
    this.run();
  }
};

if($) {
  $.fn.imagesequence = function (options) {
    return new ImageSequence(this, options);
  };
}
