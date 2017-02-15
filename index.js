'use strict';

window.onload = function () {

  // Nav button functionality //

  var aboutLink = document.getElementById('nav-about');
  var skillsLink = document.getElementById('nav-skills');
  var projectsLink = document.getElementById('nav-projects');
  var contactLink = document.getElementById('nav-contact');
  var about = document.querySelector('.about');
  var projects = document.querySelector('.projects');
  var skills = document.querySelector('.skills');
  var cards = document.querySelectorAll('.about-wrapper');

  var projectsY = Number(window.getComputedStyle(about).height.slice(0, -2));
  var skillsY = projectsY + Number(window.getComputedStyle(projects).height.slice(0, -2));
  var contactY = skillsY + Number(window.getComputedStyle(skills).height.slice(0, -2));

  aboutLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, 0);
  });
  projectsLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, projectsY);
  });
  skillsLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, skillsY);
  });
  contactLink.addEventListener('click', function () {
    event.preventDefault();
    window.scrollTo(0, contactY);
  });

  var navs = document.querySelectorAll('.navbar-btn');

  function navReset() {
    for (var i = 0; i < navs.length; i++) {
      navs[i].className = 'navbar-btn';
    }
  }

  window.addEventListener('scroll', function () {
    var y = document.body.scrollTop;
    if (y < projectsY - 200) {
      navReset();
      navs[0].classList.toggle('navbar-btn-active');
    } else if (y < skillsY - 200) {
      navReset();
      navs[1].classList.toggle('navbar-btn-active');
    } else if (y < contactY - 200) {
      navReset();
      navs[2].classList.toggle('navbar-btn-active');
    } else {
      navReset();
      navs[3].classList.toggle('navbar-btn-active');
    }
  });

  // Resize Handler //

  var skills1 = document.getElementById('skills1');
  var skills2 = document.getElementById('skills2');
  var childrenArr = [].slice.call(skills2.children);
  var skillsWrapper = document.getElementById('skills-wrapper');

  function resizeResponse() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    if (width <= 700 && height > width) {
      for (var i = 0; i < cards.length; i++) {
        if (!cards[i].classList.contains('flipped')) {
          cards[i].classList.toggle('flipped');
        }
      }
    }

    // Collapse skills into one column
    if (width <= 900 && height > width) {
      for (var _i = 0; _i < childrenArr.length; _i++) {
        skills1.appendChild(childrenArr[_i]);
      }
      if (skills2) {
        skills2.remove();
      }
    } else {
      skillsWrapper.appendChild(skills2);
      for (var _i2 = 0; _i2 < childrenArr.length; _i2++) {
        skills2.appendChild(childrenArr[_i2]);
      }
    }
  }

  resizeResponse();

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

  // About Card functionality //

  var card1 = document.querySelector('#card1');
  setTimeout(function () {
    if (!card1.classList.contains('flipped')) {
      card1.classList.toggle('flipped');
    }
  }, 500);

  for (var i = 1; i < cards.length; i++) {
    cards[i].addEventListener('mouseover', function (e) {
      var classes = e.target.classList;
      classes.contains('flipped') ? null : classes.toggle('flipped');
    });
  }

  // Carousel //

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
  for (var _i3 = 0; _i3 < slides.length; _i3++) {
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
};