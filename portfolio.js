function main() {

  let width = window.innerWidth;
  let height = window.innerHeight;

  if (width < 800) {
    let headshot = document.getElementById('headshot');
    let headWrapper = document.getElementById('about-head-wrapper');
    headWrapper.appendChild(headshot);
  }

  let down1 = document.getElementById('about-down');
  let down2 = document.getElementById('skills-down');
  let down3= document.getElementById('projects-down');
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

  let skillsColumn1 = document.getElementById('skills1');
  let column2Children = document.getElementById('skills2').children;
  let childrenArr = [].slice.call(column2Children);

  if (width <= 900) {
    for (let i = 0; i < childrenArr.length; i++) {
      skillsColumn1.appendChild(childrenArr[i]);
    }
    document.getElementById('skills2').remove();
  }

  let right = document.getElementById('scroll-right');
  let left = document.getElementById('scroll-left');
  let projects = document.querySelectorAll('#projects-wrapper > div');

  let currentCenterProject;
  if (width <= 980) {
    currentCenterProject = 0;
    projects[0].style.display = 'inline-flex';
  } else {
    currentCenterProject = 1;
    projects[0].style.display = 'inline-flex';
    projects[1].style.display = 'inline-flex';
    projects[2].style.display = 'inline-flex';
  }

  right.addEventListener('click', () => {
    if (width <= 980 && currentCenterProject !== 5) {
      projects[currentCenterProject].style.display = 'none';
      projects[currentCenterProject + 1].style.display = 'inline-flex';
      currentCenterProject++;
      console.log(projects[3].style.display);
    } else if (width > 980 && currentCenterProject !== 4) {
      projects[currentCenterProject - 1].style.display = 'none';
      projects[currentCenterProject + 2].style.display = 'inline-flex';
      currentCenterProject++;
      console.log(currentCenterProject);
    }
  });
  left.addEventListener('click', () => {
    if (width <= 980 && currentCenterProject !== 0) {
      projects[currentCenterProject].style.display = 'none';
      projects[currentCenterProject - 1].style.display = 'inline-flex';
      currentCenterProject--;
    } else if (width > 980 && currentCenterProject !== 1) {
      projects[currentCenterProject + 1].style.display = 'none';
      projects[currentCenterProject - 2].style.display = 'inline-flex';
      currentCenterProject--;
      console.log(currentCenterProject);
    }
  });


}

window.addEventListener('load', main, false);
