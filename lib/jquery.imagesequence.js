var ImageSequence = function (target, options) {

  target.imagesequence = this;
  this.target = target;
  this.options = options;

  this.parseOptions();

  this.init();

  if(this.autoplay){
    this.run();
  }
};

ImageSequence.prototype.parseOptions = function () {
  this.src = this.options.src;
  this.width = this.options.width;
  this.height = this.options.height;
  this.currentFrame = 0;
  this.image = new Image();
  this.step = 1;
  this.loop = false;
  this.running = false;
  if (this.options.loop) {
    this.loop = true;
  }
  this.autoplay = false;
  if (this.options.autoplay) {
    this.autoplay = true;
  }
  if (this.options.rewind) {
    this.step = -1;
  }
  this.shouldPlay = this.autoplay;

  this.afterAnimation = false;
  if(this.options.afterAnimation !== undefined){
    this.afterAnimation = true;
    this.animationEnded = this.options.afterAnimation;
  }

  this.path = this.options.path;
  this.indexTo = 0;
  if (this.options.indexTo) {
    this.indexTo = this.options.indexTo;
  }
  this.indexFrom = 0;
  if (this.options.indexFrom) {
    this.indexFrom = this.options.indexFrom;
  }
  this.extension = this.options.extension;
  this.images = [];
  this.mode = 'sprite';
  if(this.options.path) {
    this.mode = 'sequence';
  }

};

ImageSequence.prototype.init = function () {
  if(this.mode === 'sequence') {
    this.preloader();
  } else {
    this.image.src = this.src;
    this.target.html(this.image);
  }
  this.target.css('overflow','hidden');
};

ImageSequence.prototype.run = function () {
  this.running = true;
  var _this = this;
  setTimeout(function () {
    if(_this.shouldPlay){
      _this.nextFrame();
      _this.run();
    }
  }, 40);
};

ImageSequence.prototype.preloader = function () {
  for(var i = this.indexFrom; i <= this.indexTo; i++) {
    var img = new Image();
    var imageName = this.path + '/' + i + this.extension;
    img.src = imageName;
    this.images.push(img);
  }
};

ImageSequence.prototype.play = function () {
  this.step = 1;
  this.shouldPlay = true;
  if(this.running === false) {
    this.run();
  }
};

ImageSequence.prototype.pause = function () {
  this.step = 0;
};

ImageSequence.prototype.rewind = function () {
  this.step = -1;
  this.shouldPlay = true;
  if(this.running === false) {
    this.run();
  }
};

ImageSequence.prototype.drawCurrentFrame = function () {

  if(this.mode === 'sequence') {

    var counter = this.currentFrame;
    $(this.target.selector).css({
      'background' : 'url(' + this.images[counter].src + ') no-repeat center center',
      'background-size' : 'cover'
    });

  } else {

    var targetWidth = this.target.width();
    var targetHeight = this.target.height();

    var scaleX = targetWidth / this.width;
    var scaleY = targetHeight / this.height;
    var scale = Math.max(scaleX, scaleY);

    var frameWidth = this.width * scale;
    var frameHeight = this.height * scale;

    var x = (targetWidth - frameWidth) / 2;
    var y = (targetHeight - frameHeight) / 2;

    // Animation
    x -= this.currentFrame * frameWidth;

    $(this.image).css({
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
ImageSequence.prototype.nextFrame = function () {
  this.currentFrame = this.currentFrame + this.step;
  if (this.currentFrame >= this.countFrames()) {
    if(this.afterAnimation){
      this.animationEnded();
    }
    // On the right, end of sequence
    if (this.loop) {
      this.currentFrame -= this.countFrames();
    } else {
      this.currentFrame = this.countFrames() - 1;
      this.shouldPlay = false;
      this.running = false;
    }
  } else if (this.currentFrame < 0) {
    // On the left, beginning of sequence
    if(this.loop){
      this.currentFrame += this.countFrames();
    } else {
      this.currentFrame = 0;
      this.shouldPlay = false;
      this.running = false;
    }
  }
  this.drawCurrentFrame();
};

ImageSequence.prototype.countFrames = function () {
  if(this.mode === 'sequence') {
    return this.indexTo - this.indexFrom;
  } else {
    return this.image.naturalWidth / this.width;
  }
};

// Add method to jquery objects
if($) {
  $.fn.imagesequence = function (options) {
    return new ImageSequence(this, options);
  };
}