import _VUE from 'vue';

interface IOpt {
    maxDistance?: number;
    pressTime?: number;
}

declare const install: (Vue: typeof _VUE, options?: IOpt) => void;

export default install;