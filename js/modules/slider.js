function slider({ container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field }) {

    const slider = document.querySelector(container),
        slides = document.querySelectorAll(slide),
        slidePrev = document.querySelector(prevArrow),
        slideNext = document.querySelector(nextArrow),
        currentSlideId = document.querySelector(currentCounter),
        allSlides = document.querySelector(totalCounter),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0;

    if (slides.length < 10) {
        allSlides.innerHTML = `0${slides.length}`;
        currentSlideId.innerHTML = `0${slideIndex}`;
    } else {
        allSlides.innerHTML = slides.length;
        currentSlideId.innerHTML = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    setInterval(switchSlide, 9000);

    slideNext.addEventListener('click', switchSlide);

    slidePrev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.replace(/\D/g, '') * (slides.length - 1);
        } else {
            offset -= +width.replace(/\D/g, '')
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            currentSlideId.innerHTML = `0${slideIndex}`;
        } else {
            currentSlideId.innerHTML = slideIndex;
        }
    });

    function switchSlide() {
        if (offset == +width.replace(/\D/g, '') * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.replace(/\D/g, '')
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            currentSlideId.innerHTML = `0${slideIndex}`;
        } else {
            currentSlideId.innerHTML = slideIndex;
        }
    }
}

export default slider;