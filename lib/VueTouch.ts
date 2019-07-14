
interface VueTouchEvent {
    tap?: boolean;
    press?: boolean;
}

interface Pos {
    x: number;
    y: number;
}

let supportsPassive: boolean;
try {
    const options = Object.defineProperty({}, "passive", {
        get() {
            supportsPassive = true;
        }
    });
    window.addEventListener("test", (null as any), options);
} catch (err) {
    supportsPassive = false;
}


export default class VueTouch {
    public static config = {
        maxDistance: 10,
        pressTime: 650
    };

    private el: HTMLElement;
    private spos!: Pos;
    private epos!: Pos;
    private stime!: number;
    private stop: boolean;
    private prevent: boolean;
    private passive: boolean;
    private capture: boolean;
    private pressTimeId!: number;
    private proxy: boolean;
    private vueTouchEvent: VueTouchEvent = {};

    public constructor(el: HTMLElement, stop: boolean, prevent: boolean, passive: boolean, capture: boolean, proxy: boolean) {
        this.el = el;
        this.stop = stop;
        this.prevent = prevent;
        this.passive = passive;
        this.capture = capture;
        this.proxy = proxy;
        this.addEventListener();
    }

    public handleEvent(e: TouchEvent) {
        if (this.prevent) {
            e.preventDefault();
        }
        if (this.stop) {
            e.stopPropagation();
        }
        const type = e.type;
        const touche = e.touches[0];
        const nowTime = Date.now();
        switch (type) {
            case 'touchstart':
                this.stime = nowTime;
                const pos = {
                    x: touche.pageX,
                    y: touche.pageY
                };
                this.spos = pos;
                this.epos = pos;
                if (this.vueTouchEvent.press) {
                    this.press(e);
                }
                break;
            case 'touchmove':
                this.epos = {
                    x: touche.pageX,
                    y: touche.pageY
                };
                break;
            case 'touchend':
                const fingers = this.getFingers(e);
                const distance = this.getDistance(this.spos, this.epos);
                if (this.pressTimeId) {
                    clearTimeout(this.pressTimeId);
                }
                if (this.vueTouchEvent.tap && fingers === 0 && distance <= VueTouch.config.maxDistance && nowTime - this.stime < VueTouch.config.pressTime) {
                    if (this.pressTimeId) {
                        clearTimeout(this.pressTimeId);
                    }
                    this.sendEvent(e, 'tap');
                }

                break;
            case 'touchcancel':
                if (this.pressTimeId) {
                    clearTimeout(this.pressTimeId);
                }
                break;
        }

    }

    public on<T extends keyof VueTouchEvent>(name: T) {
        this.vueTouchEvent[name] = true;
    }

    public un() {
        if (this.pressTimeId) {
            clearTimeout(this.pressTimeId);
        }
        this.removeEventListener();
        this.vueTouchEvent = {};

    }

    private press(e: TouchEvent) {
        if (this.pressTimeId) {
            clearTimeout(this.pressTimeId);
        }
        this.pressTimeId = setTimeout(() => {
            const fingers = this.getFingers(e);
            const distance = this.getDistance(this.spos, this.epos);
            if (this.vueTouchEvent.press && fingers === 1 && distance <= VueTouch.config.maxDistance) {
                this.sendEvent(e, 'press');
            }
        }, VueTouch.config.pressTime);
    }

    private getDistance(p1: Pos, p2: Pos) {
        const x = p2.x - p1.x;
        const y = p2.y - p1.y;
        return Math.sqrt((x * x) + (y * y));
    }

    private getFingers(evt: TouchEvent) {
        return evt.touches ? evt.touches.length : 1;
    }

    private addEventListener() {
        const options = supportsPassive ? { capture: this.capture, passive: this.passive } : this.capture;
        this.el.addEventListener('touchstart', this, options);
        this.el.addEventListener('touchmove', this, options);
        this.el.addEventListener('touchend', this, options);
        this.el.addEventListener('touchcancel', this, options);
    }

    private removeEventListener() {
        const options = supportsPassive ? { capture: this.capture, passive: this.passive } : this.capture;
        this.el.removeEventListener('touchstart', this, options);
        this.el.removeEventListener('touchmove', this, options);
        this.el.removeEventListener('touchend', this, options);
        this.el.removeEventListener('touchcancel', this, options);
    }

    private sendEvent<T extends keyof VueTouchEvent>(e: TouchEvent, name: T) {
        const evt = document.createEvent('HTMLEvents');
        const target: HTMLElement = (e.srcElement || e.target) as HTMLElement;
        let currentTarget = target;
        if (this.proxy && !!currentTarget && currentTarget !== this.el) {
            while (true) {
                const dataset = currentTarget.dataset;
                if (typeof dataset.proxy !== 'undefined' || currentTarget === this.el) {
                    Object.defineProperty(evt, 'currentTarget', {
                        value: currentTarget
                    });
                    break;
                } else {
                    currentTarget = currentTarget.parentNode as HTMLElement;
                }

            }
        }
        evt.initEvent(name, true, true);
        target.dispatchEvent(evt);
    }

}
