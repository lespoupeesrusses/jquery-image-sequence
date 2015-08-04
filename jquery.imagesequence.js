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
    _this.target.css('width', _this.width);
    _this.target.css('height', _this.height);
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

    var scaleX = _this.target.width() / _this.width;
    var scaleY = _this.target.height() / _this.height;
    var scale = Math.max(scaleX, scaleY);

    var frameWidth = _this.width * scale;
    var frameHeight = _this.height * scale;

    var y = (_this.target.height() - frameHeight)/2;
    var x = (_this.target.width() - frameWidth)/2;
    x -= _this.currentFrame * frameWidth;

    $(_this.image).css({
      'transform' : "translate3d(" + x + "px,"+ y +"px,0) scale3d(" + scale + "," + scale + ", 1)"
    });
  }

  this.nextFrame = function () {
    if(this.currentFrame > 50) {
      this.currentFrame = 0;
    } else {
      this.currentFrame++;
    }
    this.drawCurrentFrame();
  }

  this.init();
  this.run();

}

if($) {

  $.fn.imagesequence = function (options) {

    new ImageSequence(this, options);

  }

}
