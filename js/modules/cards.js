import { getResourse } from '../serviсes/services';

function cards() {

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

    getResourse('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').createCard();
            });
        });
}

export default cards;
