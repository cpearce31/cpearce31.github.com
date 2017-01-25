function main () {
  function resizeResponse () {
    width = window.innerWidth;

    // Move photo in about section next to header
    if (width < 800) {
      headWrapper.appendChild(headshot);
    } else {
      aboutMain.appendChild(headshot);
    }

    // Collapse skills into one column
    if (width <= 900) {
      for (let i = 0; i < childrenArr.length; i++) {
        skillsColumn1.appendChild(childrenArr[i]);
      }
      if (skills2) {
        skills2.remove();
      }
    } else {
      skillsWrapper.appendChild(skills2);
      for (let i = 0; i < childrenArr.length; i++) {
        skills2.appendChild(childrenArr[i]);
      }
    }

    // Show only one project
    if (width <= 980) {
      currentCenterProject = 0;
      for (let i = 0; i < projects.length; i++) {
        projects[i].style.display = 'none';
      }
      ticks[0].classList.add('tick-active');
      projects[0].style.display = 'inline-flex';
    } else {
      currentCenterProject = 1;
      for (let i = 0; i < 3; i++) {
        projects[i].style.display = 'inline-flex';
        ticks[i].classList.add('tick-active');
      }
    }
  }

  window.addEventListener('resize', resizeThrottler, false);

  let resizeTimeout;
  function resizeThrottler () {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        resizeResponse();
      }, 66);
    }
  }

  let width = window.innerWidth;
  let height = window.innerHeight;

  let down1 = document.getElementById('about-down');
  let down2 = document.getElementById('skills-down');
  let down3 = document.getElementById('projects-down');
  let navbarHeight = 50;

  down1.addEventListener('click', () => {
    window.scrollTo(0, height - navbarHeight);
  });
  down2.addEventListener('click', () => {
    window.scrollTo(0, 2 * height - 2 * navbarHeight);
  });
  down3.addEventListener('click', () => {
    window.scrollTo(0, 3 * height - 3 * navbarHeight);
  });

  let aboutLink = document.getElementById('nav-about');
  let skillsLink = document.getElementById('nav-skills');
  let projectsLink = document.getElementById('nav-projects');
  let contactLink = document.getElementById('nav-contact');

  aboutLink.addEventListener('click', () => {
    event.preventDefault();
    window.scrollTo(0, 0);
  });
  skillsLink.addEventListener('click', () => {
    event.preventDefault();
    window.scrollTo(0, height - navbarHeight);
  });
  projectsLink.addEventListener('click', () => {
    event.preventDefault();
    window.scrollTo(0, 2 * height - 2 * navbarHeight);
  });
  contactLink.addEventListener('click', () => {
    event.preventDefault();
    window.scrollTo(0, 3 * height - 3 * navbarHeight);
  });

  let headshot = document.getElementById('headshot');
  let headWrapper = document.getElementById('about-head-wrapper');
  let aboutMain = document.getElementById('about-main');

  let skillsColumn1 = document.getElementById('skills1');
  let column2Children = document.getElementById('skills2').children;
  let childrenArr = [].slice.call(column2Children);
  let skills2 = document.getElementById('skills2');
  let skillsWrapper = document.getElementById('skills-wrapper');

  let right = document.getElementById('scroll-right');
  let left = document.getElementById('scroll-left');
  let projects = document.querySelectorAll('#projects-wrapper > div');
  let ticks = document.querySelectorAll('.tick');
  let currentCenterProject;

  right.addEventListener('click', () => {
    if (width <= 980 && currentCenterProject !== 5) {
      projects[currentCenterProject].style.display = 'none';
      projects[currentCenterProject + 1].style.display = 'inline-flex';
      ticks[currentCenterProject].classList.toggle('tick-active');
      ticks[currentCenterProject + 1].classList.toggle('tick-active');
      currentCenterProject++;
    } else if (width > 980 && currentCenterProject !== 4) {
      projects[currentCenterProject - 1].style.display = 'none';
      projects[currentCenterProject + 2].style.display = 'inline-flex';
      ticks[currentCenterProject - 1].classList.toggle('tick-active');
      ticks[currentCenterProject + 2].classList.toggle('tick-active');
      currentCenterProject++;
    }
  });
  left.addEventListener('click', () => {
    if (width <= 980 && currentCenterProject !== 0) {
      projects[currentCenterProject].style.display = 'none';
      projects[currentCenterProject - 1].style.display = 'inline-flex';
      ticks[currentCenterProject].classList.toggle('tick-active');
      ticks[currentCenterProject - 1].classList.toggle('tick-active');
      currentCenterProject--;
    } else if (width > 980 && currentCenterProject !== 1) {
      projects[currentCenterProject + 1].style.display = 'none';
      projects[currentCenterProject - 2].style.display = 'inline-flex';
      ticks[currentCenterProject + 1].classList.toggle('tick-active');
      ticks[currentCenterProject - 2].classList.toggle('tick-active');
      currentCenterProject--;
    }
  });

  resizeResponse();
}

window.addEventListener('load', main, false);
