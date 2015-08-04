var ImageSequence = function (target, options) {

  target.imagesequence = this;
  this.target = target;
  this.src = options.src;
  this.width = options.width;
  this.height = options.height;
  this.image = new Image;
  var _this = this;

  this.init = function () {
    _this.image.src = _this.src;
    _this.currentFrame = 0;
    _this.target.css('overflow','hidden');
    _this.target.html(_this.image);
  }

  this.run = function () {
    setTimeout(function () {
      _this.nextFrame();
      _this.run();
    }, 40);
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
    y = 0;

    // Animation
    x -= _this.currentFrame * frameWidth;

    $(_this.image).css({
      'transform' : "translate3d(" + x + "px,"+ y +"px,0) scale(" + scale + ", " + scale + ")",
      'transform-origin' : 'left top'
    });
  }

  this.nextFrame = function () {
    if(_this.hasNextFrame()) {
      _this.currentFrame++;
    } else {
      _this.currentFrame = 0;
    }
    _this.drawCurrentFrame();
  }

  this.hasNextFrame = function () {
    return (_this.currentFrame+1) * _this.width < _this.image.naturalWidth;
  }

  this.init();
  this.run();
}

if($) {
  $.fn.imagesequence = function (options) {
    new ImageSequence(this, options);
  }
}
