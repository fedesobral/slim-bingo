export function createCard() {
    const max = 12;
    const maxUsed = 7;
    const used = {};
    let count = 0;
    let data = [];
    let disabledCount = 0;
    for (let i = 0; i < max; ++i) {
        let val = -1;
        if ((getRandomInt(10) % 2 == 1 && count < maxUsed) || max - maxUsed == i - count || disabledCount == 2) {
            while (val == -1 || used[val]) {
                val = getRandomInt(100);
            }
            used[val] = true;
            data.push({ id: val, text: val, checked: false });
            ++count;
            disabledCount=0;
        } else {
            ++disabledCount;
            data.push({ id: -1, text: '', checked: false });
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    return data;
}

export function createCards(count){
    let cards = [];
    for (let i = 0; i < count; i++) {
      cards.push(createCard());      
    }
    return cards;
}