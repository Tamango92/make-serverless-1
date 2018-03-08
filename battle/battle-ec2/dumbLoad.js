module.exports = dumbLoad;

const loopSize = 100000;

function dumbLoad(cb) {
    for (let i = 0; i <= loopSize; i++) {
        let to = setTimeout(() => {
            let val = Math.random()*Math.random()*Math.random();
            clearTimeout(to);
            if (i === loopSize) {
                cb(val);
            }
        }, 4)
    }
}