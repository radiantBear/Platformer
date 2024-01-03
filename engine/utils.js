export function randInt(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}


export function getTime() {
    let d = new Date();
    return d.getTime();
}