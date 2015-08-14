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
  this.verbose = false;
  if (this.options.verbose) {
    this.verbose = true;
  }
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

  $(this.target.selector).prepend('<canvas id="' + this.target.selector + '"></canvas>');
  this.canvas = document.getElementById(this.target.selector);
  this.context = this.canvas.getContext('2d');
};

ImageSequence.prototype.init = function () {
  if(this.mode === 'sequence') {
    this.preloader();
    if(!this.shouldPlay) {
      this.drawCanvas(this.images[0]);
    }
  } else {
    this.image.src = this.src;
    this.target.html(this.image);
  }
  this.target.css('overflow','hidden');
  var _this = this;
  window.addEventListener('resize', function() {
    _this.resize();
  });
};

ImageSequence.prototype.run = function () {
  this.running = true;
  var _this = this;
  setTimeout(function () {
    if(_this.shouldPlay){
      _this.nextFrame();
      _this.run();
    } else {
      _this.running = false;
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
  if (this.verbose) {
    console.log('play');
  }
  this.step = 1;
  this.shouldPlay = true;
  if (this.running === false) {
    this.run();
  }
};

ImageSequence.prototype.pause = function () {
  if (this.verbose) {
    console.log('pause');
  }
  this.shouldPlay = false;
};

ImageSequence.prototype.rewind = function () {
  if (this.verbose) {
    console.log('rewind');
  }
  this.step = -1;
  this.shouldPlay = true;
  if (this.running === false) {
    this.run();
  }
};

ImageSequence.prototype.goToFirstFrame = function () {
    this.goToFrame(0);
};

ImageSequence.prototype.goToLastFrame = function () {
    this.goToFrame(this.countFrames());
};

ImageSequence.prototype.goToFrame = function (frame) {
    this.currentFrame = frame;
};

ImageSequence.prototype.drawCanvas = function (src) {

  var img = new Image();
      img.src = src.src;

  var targetWidth = this.target.width();
  var targetHeight = this.target.height();

  var scaleX = targetWidth / img.width;
  var scaleY = targetHeight / img.height;
  var scale = Math.max(scaleX, scaleY);

  var frameWidth = img.width * scale;
  var frameHeight = img.height * scale;

  var windowWidth     = $(window).outerWidth(),
      windowHeight    = $(window).outerHeight();
  // Set the canvas width
  this.canvas.width = targetWidth;
  this.canvas.height = windowHeight;

  this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height );

  this.context.drawImage(
    img, // The image source
    (this.canvas.width - frameWidth) / 2, // X position - center it in the canvas
    (this.canvas.height - frameHeight) / 2, // Y position - 0px from the top
    frameWidth, // The width of the image - grab the scaled frameWidth
    frameHeight // Height of the image - grab the scaled frameHeight
  );
};

ImageSequence.prototype.resize = function (e) {
    this.drawCurrentFrame();
};

ImageSequence.prototype.drawCurrentFrame = function () {

  if(this.mode === 'sequence') {

    var counter = this.currentFrame;
    this.drawCanvas(this.images[counter]);

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
  if (this.verbose) {
    console.log('nextFrame', this.currentFrame);    
  }
  if (this.currentFrame >= this.countFrames()) {
    if (this.afterAnimation) {
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
    if (this.afterAnimation) {
      this.animationEnded();
    }
    if (this.loop){
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
