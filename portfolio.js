'use strict';

window.onload = main;

function main() {
  function resizeResponse() {
    width = window.innerWidth;

    // Move photo in about section next to header
    if (width < 800) {
      headWrapper.appendChild(headshot);
    } else {
      aboutMain.appendChild(headshot);
    }

    // Collapse skills into one column
    if (width <= 900 && height > width) {
      for (var i = 0; i < childrenArr.length; i++) {
        skills1.appendChild(childrenArr[i]);
      }
      if (skills2) {
        skills2.remove();
      }
    } else {
      skillsWrapper.appendChild(skills2);
      for (var _i = 0; _i < childrenArr.length; _i++) {
        skills2.appendChild(childrenArr[_i]);
      }
    }
  }

  window.addEventListener('resize', resizeThrottler, false);

  var resizeTimeout = void 0;
  function resizeThrottler() {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        resizeResponse();
      }, 66);
    }
  }

  var width = window.innerWidth;
  var height = window.innerHeight;
  var sections = document.querySelectorAll('.section');
  var navbarHeight = 50;
  var sectionHeight = height - navbarHeight;

  // Set height of each section to the full height of the viewport
  // unless on a small device in portrait mode
  if (sectionHeight < 500 && width > height) {
    sectionHeight = sectionHeight * 2;
  }
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.height = sectionHeight + 'px';
  }

  var aboutLink = document.getElementById('nav-about');
  var skillsLink = document.getElementById('nav-skills');
  var projectsLink = document.getElementById('nav-projects');
  var contactLink = document.getElementById('nav-contact');

  aboutLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, 0);
  });
  skillsLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, sectionHeight);
  });
  projectsLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, sectionHeight * 2);
  });
  contactLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, sectionHeight * 3);
  });

  var headshot = document.getElementById('headshot');
  var headWrapper = document.getElementById('about-head-wrapper');
  var aboutMain = document.getElementById('about-main');

  var skills1 = document.getElementById('skills1');
  var column2Children = document.getElementById('skills2').children;
  var childrenArr = [].slice.call(column2Children);
  var skills2 = document.getElementById('skills2');
  var skillsWrapper = document.getElementById('skills-wrapper');

  resizeResponse();

  var AUTOSCROLL = false; // Change to true to enable autoscrolling
  var PERIOD = 5000; // Time spent on each slide in milliseconds

  // If touch events are detected, disable autoscrolling
  var touchDevice = false;
  window.addEventListener('touchstart', function () {
    touchDevice = true;
  });

  var slides = document.querySelectorAll('.carousel-slide');
  var left = document.querySelector('#carousel-btn-left');
  var right = document.querySelector('#carousel-btn-right');
  var indicator = document.querySelector('#carousel-scroll-indicator');
  var wrapper = document.querySelector('#carousel-wrapper');

  // Add bullets to the scoll indicator section for each slide
  for (var _i2 = 0; _i2 < slides.length; _i2++) {
    var pip = document.createElement('i');
    pip.className = 'carousel-pip fa fa-square';
    pip.toggle = function () {
      this.classList.toggle('carousel-pip-active');
    };
    indicator.appendChild(pip);
  }

  var index = 0;
  var pips = document.querySelectorAll('.carousel-pip');
  pips[0].toggle();

  // Wrap-around handling for scroll-idicators (pips!)
  function changePip(direction) {
    pips[index].toggle();
    if (direction === 'right') {
      if (index === pips.length - 1) {
        index = 0;
      } else {
        index++;
      }
    } else if (direction === 'left') {
      if (index === 0) {
        index = pips.length - 1;
      } else {
        index--;
      }
    }
    pips[index].toggle();
  }

  // Remove last slide and insert it at the begining of the list,
  // in case the first move is to the left
  slides[slides.length - 1].remove();
  setPosition(slides[slides.length - 1], 'left');
  wrapper.insertBefore(slides[slides.length - 1], slides[0]);
  slides = document.querySelectorAll('.carousel-slide');

  function setPosition(slide, pos) {
    if (pos === 'right') {
      slide.className = 'carousel-slide carousel-slide-right';
    } else if (pos === 'left') {
      slide.className = 'carousel-slide carousel-slide-left';
    } else {
      slide.className = 'carousel-slide carousel-slide-active';
    }
  }

  function move(direction) {
    if (direction === 'right') {
      setPosition(slides[1], 'left');
      setPosition(slides[2]);
      slides[0].remove();
      setPosition(slides[0], 'right');
      wrapper.appendChild(slides[0]);
      slides = document.querySelectorAll('.carousel-slide');
    } else if (direction === 'left') {
      setPosition(slides[0]);
      setPosition(slides[1], 'right');
      slides[slides.length - 1].remove();
      setPosition(slides[slides.length - 1], 'left');
      wrapper.insertBefore(slides[slides.length - 1], slides[0]);
      slides = document.querySelectorAll('.carousel-slide');
    }
    changePip(direction);
  }

  right.addEventListener('click', function () {
    move('right');
  });

  left.addEventListener('click', function () {
    move('left');
  });

  function startAutoScroll() {
    if (AUTOSCROLL && !touchDevice) {
      interval = setInterval(function () {
        move('right');
      }, PERIOD);
    }
  }

  wrapper.addEventListener('mouseover', function () {
    if (interval) {
      clearInterval(interval);
    }
  });

  wrapper.addEventListener('mouseout', function () {
    startAutoScroll();
  });

  var interval = void 0;
  startAutoScroll();

  var navs = document.querySelectorAll('.navbar-btn');

  function navReset() {
    for (var _i3 = 0; _i3 < navs.length; _i3++) {
      navs[_i3].className = 'navbar-btn';
    }
  }

  window.addEventListener('scroll', function () {
    var offset = height * 0.4;
    var y = document.body.scrollTop;
    if (y < sectionHeight - offset) {
      navReset();
      navs[0].classList.toggle('navbar-btn-active');
    } else if (y < sectionHeight * 2 - offset) {
      navReset();
      navs[1].classList.toggle('navbar-btn-active');
    } else if (y < sectionHeight * 3 - offset) {
      navReset();
      navs[2].classList.toggle('navbar-btn-active');
    } else {
      navReset();
      navs[3].classList.toggle('navbar-btn-active');
    }
  });
};