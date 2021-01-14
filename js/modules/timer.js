function timer() {

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
}

export default timer;