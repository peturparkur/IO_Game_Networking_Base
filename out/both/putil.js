function RollArray(arr, offset = 1) {
    if (offset === 0)
        return;
    // offset > 0, means roll it to left
    // ofset < 0 means roll it to right
    if (offset > 0) {
        for (let i = 0; i < offset; i++) {
            let x = arr.shift();
            arr.push(x);
        }
        return;
    }
    else {
        offset = -offset;
        for (let i = 0; i < offset; i++) {
            let x = arr.pop();
            arr.unshift(x);
        }
    }
}
export { RollArray };
