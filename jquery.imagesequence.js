var ImageSequence = function (target, options) {

  target.imagesequence = this;

  this.target = target;
  this.src = options.src;
  this.width = options.width;
  this.height = options.height;
  this.controls = options.controls;
  this.image = new Image();
  this.step = 1;

  var _this = this;

  this.init = function () {
    _this.image.src = _this.src;
    _this.currentFrame = 0;
    _this.target.css('overflow','hidden');
    _this.target.html(_this.image);
    _this.displayControls();
  }

  this.displayControls = function () {
    if(_this.controls == true) {
      _this.target.append(
        '<div class="play-btn">\
          <a href="#" class="play">Play</a>\
          <a href="#" class="rewind">Rewind</a>\
         </div>'
      );
    }
    $('.rewind').on('click', function () {
      _this.rewind();
    });
  }

  this.run = function () {
    setTimeout(function () {
      _this.nextFrame();
      _this.run();
    }, 40);
  }

  this.rewind = function () {
    _this.step = -1;
  }

  this.drawCurrentFrame = function () {
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

  this.nextFrame = function () {
    _this.currentFrame = (_this.currentFrame + _this.step) % _this.countFrames();
    if (_this.currentFrame < 0) {
      _this.currentFrame += _this.countFrames();
    }
    _this.drawCurrentFrame();
  }

  this.countFrames = function () {
    return _this.image.naturalWidth / _this.width;
  }

  this.init();
  this.run();
}

if($) {
  $.fn.imagesequence = function (options) {
    return new ImageSequence(this, options);
  }
}
