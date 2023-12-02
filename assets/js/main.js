let currentIndexVietNam = 0;
let currentIndexThaiLand = 0;

function clickNext(country) {
  if (country === 'vietnam' && currentIndexVietNam < 2) {
    currentIndexVietNam++;
    updateBoxes(country);
  } else if (country === 'thailand' && currentIndexThaiLand < 2) {
    currentIndexThaiLand++;
    updateBoxes(country);
  }
}

function clickPrevious(country) {
  if (country === 'vietnam' && currentIndexVietNam > 0) {
    currentIndexVietNam--;
    updateBoxes(country);
  } else if (country === 'thailand' && currentIndexThaiLand > 0) {
    currentIndexThaiLand--;
    updateBoxes(country);
  }
}

function updateBoxes(country) {
  const boxes = document.querySelectorAll(`.box.${country}`);
  const navigationRight = document.querySelector(`.${country} .navigation-right`);
  const navigationLeft = document.querySelector(`.${country} .navigation-left`);

  anime({
    targets: `.box.${country}.active`,
    opacity: 0,
    duration: 200,
    easing: 'easeInOutQuad',
    complete: function () {
      boxes.forEach(box => box.classList.remove('active'));
      boxes[country === 'vietnam' ? currentIndexVietNam : currentIndexThaiLand].classList.add('active');

      if ((currentIndexVietNam === 2 && country === 'vietnam') || (currentIndexThaiLand === 2 && country === 'thailand')) {
        navigationRight.style.display = 'none';
        navigationLeft.style.display = 'block';
      } else if ((currentIndexVietNam === 0 && country === 'vietnam') || (currentIndexThaiLand === 0 && country === 'thailand')) {
        navigationLeft.style.display = 'none';
      } else {
        navigationRight.style.display = 'block';
        navigationLeft.style.display = 'block';
      }

      anime({
        targets: `.box.${country}.active`,
        opacity: 1,
        duration: 200,
        easing: 'easeInOutQuad'
      });
    }
  });
}
