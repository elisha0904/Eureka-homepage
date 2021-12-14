// 마우스 커서
var polyline = document.querySelector('.drawing_line_polyline');
var polyPoints = polyline.getAttribute('points');
var circle = document.querySelector('.drawing_line_circle');
var circleX = circle.getAttribute('cx');
var circleY = circle.getAttribute('cy');
var circleR = circle.getAttribute('r');

var total = 12;
var gap = 30;
var ease = 0.5;
var debounce_removeLine;
var debounce_counter = 0;

var pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  tx: 0,
  ty: 0,
  dist: 0,
  scale: 1,
  speed: 2,
  circRadius: 20,
  updateCrds: function () {
    if (this.x != 0) {
      this.dist = Math.abs((this.x - this.tx) + (this.y - this.ty));
      this.scale = Math.max(this.scale + ((100 - this.dist * 8) * 0.01 - this.scale) * 0.1, 0.5);
      this.tx += (this.x - this.tx) / this.speed;
      this.ty += (this.y - this.ty) / this.speed;
    }
  }
};

var points = [];

$(window).on('mousemove', function (e) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  debounce_counter = 0;
  drawLine();

  clearTimeout(debounce_removeLine);
  debounce_removeLine = setTimeout(() => {
    debounce_counter = 12;
    drawLine();
  }, 80);
})

$(window).on('mousedown', function (e) {
  pointer.circRadius = 6;
  drawLine();
});

$(window).on('mouseup', function (e) {
  pointer.circRadius = 8;
  drawLine();
});

function drawLine() {
  pointer.updateCrds();

  points.push({
    x: pointer.tx,
    y: pointer.ty
  });
  while (points.length > total) {
    points.shift();
    if (points.length > gap) {
      for (var i = 0; i < 5; i++) {
        points.shift();
      }
    }
  }
  var pointsArr = points.map(point => `${point.x},${point.y}`);
  polyPoints = pointsArr.join(' ');
  polyline.setAttribute('points', polyPoints);

  // circle
  circleX = pointer.x;
  circleY = pointer.y;
  circleR = pointer.scale * pointer.circRadius;

  circle.setAttribute('cx', circleX);
  circle.setAttribute('cy', circleY);
  circle.setAttribute('r', circleR);

  if (debounce_counter > 0) {
    debounce_counter--;
    requestAnimationFrame(drawLine);
  }
}


//스크롤 등장
function isElementUnderBottom(elem, triggerDiff) {
    const { top } = elem.getBoundingClientRect();
    const { innerHeight } = window;
    return top > innerHeight + (triggerDiff || 0);
  }
  
  function handleScroll() {
    const elems = document.querySelectorAll('.up-on-scroll');
    elems.forEach(elem => {
      if (isElementUnderBottom(elem, -20)) {
        elem.style.opacity = "0";
        elem.style.transform = 'translateY(70px)';
      } else {
        elem.style.opacity = "1";
        elem.style.transform = 'translateY(0px)';
      }
    })
  }
  
  window.addEventListener('scroll', handleScroll);

  //부드러운 스크롤
  $("html").easeScroll({
      frameRate: 60,
      animationTime: 500,
      stepSize: 120,
      pulseAlgorithm: 1,
      pulseScale: 8,
      pulseNormalize: 1,
      accelerationDelta: 20,
      accelerationMax: 1,
      keyboardSupport:true,
      arrowScroll: 10,
      touchpadSupport:true,
      fixedBackground:true
    });


 