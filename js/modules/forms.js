import {showModal, hideModal} from './modal';

function forms() {
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

            postData('http://localhost:3000/request', json)
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
}

export default forms;