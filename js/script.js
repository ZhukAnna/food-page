'use strict';

import tabs from './modules/tabs';
import modal from './modules/modal';
import forms from './modules/forms';
import cards from './modules/cards';
import slider from './modules/slider';
import calc from './modules/calc';
import timer from './modules/timer';

window.addEventListener('DOMContentLoaded', () => {
    tabs();
    modal('[data-modal]', '.modal');
    forms();
    cards();
    slider();
    calc();
    timer();
});