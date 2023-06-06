const themeSwitcher = document.querySelector('#theme-switcher');
const heroOverlay = document.querySelector('.hero-overlay');
const heroText = heroOverlay.querySelector('h1');
const words = heroText.textContent.split(' ');
const navigation = document.querySelector('header');
let prevScrollPos = window.pageYOffset;
let isNavVisible = true;
let wordSpans = [];

words.forEach((word) => {
  const wordSpan = document.createElement('span');
  wordSpan.textContent = word;
  heroText.appendChild(wordSpan);
  wordSpans.push(wordSpan);
});

heroOverlay.addEventListener('mousemove', function (e) {
  const { offsetX, offsetY } = e;

  wordSpans.forEach((wordElement) => {
    const { left, top, width, height } = wordElement.getBoundingClientRect();

    const isCursorInsideWord =
      offsetX >= left &&
      offsetX <= left + width &&
      offsetY >= top &&
      offsetY <= top + height;

    if (isCursorInsideWord) {
      wordElement.classList.add('hovered');
    } else {
      wordElement.classList.remove('hovered');
    }
  });
});

heroOverlay.addEventListener('mouseleave', function () {
  wordSpans.forEach((wordElement) => {
    wordElement.classList.remove('hovered');
  });
});

window.addEventListener('scroll', function() {
  const currentScrollPos = window.pageYOffset;
  const scrollingDown = currentScrollPos > prevScrollPos;

  if (scrollingDown && isNavVisible) {
    navigation.style.opacity = '0';
    isNavVisible = false;
  } else if (!scrollingDown && !isNavVisible) {
    navigation.style.opacity = '1';
    isNavVisible = true;
  }

  prevScrollPos = currentScrollPos;
});


themeSwitcher.addEventListener('change', function() {
  if (this.checked) {
    document.documentElement.style.setProperty('--primary-color', '#9c27b0');
    document.documentElement.style.setProperty('--secondary-color', '#f44336');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
  } else {
    document.documentElement.style.setProperty('--primary-color', '#ff6f00');
    document.documentElement.style.setProperty('--secondary-color', '#009688');
    document.documentElement.style.setProperty('--text-color', '#333333');
  }
});

$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });
});

// Add 'active' class to the current section in view
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach(function(section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - sectionHeight / 2 && window.pageYOffset < sectionTop + sectionHeight / 2) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
});
