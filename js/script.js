'use strict';

window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsHolder = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsHolder.addEventListener('click', (event) => {
        let target = event.target;
        if (target && target.matches('.tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const actionEnd = new Date(2021, 0, 31, 23, 59, 59),
        days = document.querySelector('span#days'),
        hours = document.querySelector('span#hours'),
        minutes = document.querySelector('span#minutes'),
        seconds = document.querySelector('span#seconds'),
        timer = setInterval(refreshTimer, 1000);

    function refreshTimer() {
        let now = new Date(),
            actionTime = actionEnd - now,
            secT = Math.floor(((actionTime) / 1000) % 60),
            minT = Math.floor(((actionTime) / (1000 * 60)) % 60),
            houT = Math.floor(((actionTime) / (1000 * 60 * 60)) % 24),
            dayT = Math.floor(((actionTime) / (1000 * 60 * 60 * 24)));

        if (actionTime <= 0) {
            clearInterval(timer);
            seconds.textContent = '00';
            minutes.textContent = '00';
            hours.textContent = '00';
            days.textContent = '00';
        } else {
            seconds.textContent = secT;
            minutes.textContent = minT;
            hours.textContent = houT;
            days.textContent = dayT;
        }
    }

    // Modal

    const modalOpen = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearTimeout(modalTimerId);
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalOpen.forEach(item => {
        item.addEventListener('click', showModal);
    });

    // modal.querySelector('form').addEventListener('submit', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.style.display == 'block') {
            hideModal();
        }
    });

    const modalTimerId = setTimeout(showModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Классы для карточек Меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parent);
        }

        createCard() {

            const newDiv = document.createElement('div');
            if (this.classes.length === 0) {
                this.newDiv = 'menu__item';
                newDiv.classList.add(this.newDiv);
            } else {
                this.classes.forEach(className => newDiv.classList.add(className));
            }

            newDiv.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
            `;
            this.parent.append(newDiv);
        }
    }

    const getResourse = async (url, data) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResourse('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').createCard();
            });
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: '/img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            dispay: block;
            margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('server.php', json)
                .then(data => {
                    console.log(data);
                    showModalThanks(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showModalThanks(message.failure);
                }).finaly(() => {
                    form.reset();
                })
        });
    }

    function showModalThanks(message) {
        const prevModalDialog = document.querySelector('div.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            hideModal();
        }, 4000);
    }

    fetch('http://localhosts:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

    // Slider

    const slides = document.querySelectorAll('.offer__slide'),
        slidePrev = document.querySelector('.offer__slider-prev'),
        slideNext = document.querySelector('.offer__slider-next'),
        currentSlideId = document.querySelector('#current'),
        allSlides = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
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
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2)
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
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2)
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
});