import _VUE from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import VueTouch from './VueTouch';

interface VueTouchHTMLElement extends HTMLElement {
    vueTouch: VueTouch;
}

interface IOpt {
    maxDistance?: number;
    pressTime?: number;
}


const install = (Vue: typeof _VUE, options?: IOpt) => {
    if (options) {
        // 此处不适用es7 对象合并， 否则会使webpack编译出来的包变大
        if (options.maxDistance) {
            VueTouch.config.maxDistance = options.maxDistance;
        }
        if (options.pressTime) {
            VueTouch.config.maxDistance = options.pressTime;
        }
    }
    Vue.directive('touch', {
        bind(el: HTMLElement, binding: DirectiveBinding) {
            const modifiers = binding.modifiers;
            const stop = !!modifiers.stop;
            const prevent = !!modifiers.prevent;
            const passive = !!modifiers.passive;
            const capture = !!modifiers.capture;
            const proxy = !!modifiers.proxy;
            let tap = !!modifiers.tap;
            const press = !!modifiers.press;

            if (!tap && !press) {
                tap = true;
            }

            const touchElment = el as VueTouchHTMLElement;
            const vueTouch = new VueTouch(el, stop, prevent, passive, capture, proxy);

            if (tap) {
                vueTouch.on('tap');
            }

            if (press) {
                vueTouch.on('press');
            }

            touchElment.vueTouch = vueTouch;


        },
        unbind(el) {
            const vueTouch = (el as VueTouchHTMLElement).vueTouch;
            if (vueTouch) {
                vueTouch.un();
                delete (el as VueTouchHTMLElement).vueTouch;
            }

        }
    });

};
export default install;
