'use strict';

window.onload = main;

function main() {
  function resizeResponse() {
    width = window.innerWidth;

    // Adjust about section
    if (width < 721) {
      card3.appendChild(img);
      card2.remove();
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

  /*
  if (sectionHeight < 500 && width > height) {
    sectionHeight = sectionHeight * 2;
  }
  for (let i = 0; i < sections.length; i++) {
    sections[i].style.height = sectionHeight + 'px';
  } */

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

  // About screen animations
  var card1 = document.querySelector('.card-1');
  var card2 = document.querySelector('.card-2');
  var card3 = document.querySelector('.card-3');
  var card4 = document.querySelector('.card-4');
  var elip = document.querySelector('.about-ellipses');
  var img = document.querySelector('.about-main-img');
  if (width >= 720) {
    setTimeout(function () {
      elip.innerText += '.';
      setTimeout(function () {
        elip.innerText += '.';
        setTimeout(function () {
          elip.innerText += '.';
          setTimeout(function () {
            card2.style.opacity = 1;
            card3.style.opacity = 1;
            elip.innerText = '';
            setTimeout(function () {
              /*  card2.style.borderLeft = '1px none black';
                card3.style.borderTop = '1px none black';
                card1.style.borderRight = '1px none black';
                card1.style.borderBottom = '1px none black'; */
            }, 900);
            setTimeout(function () {
              card4.style.opacity = 1; /*
                                       card2.style.borderBottom = '1px none black';
                                       card3.style.borderRight = '1px none black';
                                       card4.style.borderLeft = '1px none black';
                                       card4.style.borderTop = '1px none black'; */
            }, 4000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 2000);
  }

  var skills1 = document.getElementById('skills1');
  var column2Children = document.getElementById('skills2').children;
  var childrenArr = [].slice.call(column2Children);
  var skills2 = document.getElementById('skills2');
  var skillsWrapper = document.getElementById('skills-wrapper');

  resizeResponse();

  /*** Carousel ***/

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
  for (var i = 0; i < slides.length; i++) {
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
    for (var _i2 = 0; _i2 < navs.length; _i2++) {
      navs[_i2].className = 'navbar-btn';
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