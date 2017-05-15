export default degPerSec => {
    /*eslint no-console: 0 */
    const _ = {
        spin: true,
        lastTick: new Date(),
        degree: degPerSec,
        sync: []
    }

    function rotate(delta) {
        const r = this._.proj.rotate();
        r[0] += _.degree * delta / 1000;
        this._.rotate(r);
    }

    return {
        name: 'autorotatePlugin',
        onInit() {
            this._.options.spin = true;
        },
        onInterval() {
            const now = new Date();
            if (!_.spin || this._.drag) {
                _.lastTick = now;
            } else {
                const delta = now - _.lastTick;
                rotate.call(this, delta);
                _.sync.forEach(p => rotate.call(p, delta));
                _.lastTick = now;
            }
        },
        speed(degPerSec) {
            _.degree = degPerSec;
        },
        start() {
            _.spin = true;
        },
        stop() {
            _.spin = false;
        },
        sync(arr) {
            _.sync = arr;
        }
    };
}
