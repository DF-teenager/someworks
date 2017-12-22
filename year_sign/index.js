Vue.use(VAnimateCss.default);

var vm = new Vue({
    el: '#app',
    data: {
        transition1: {
            classes: 'slideInDown',
            duration: 1000,
            delay: 0,
        },
        transition2: {
            classes: 'zoomIn',
            duration: 1000,
            delay: 200
        },
        transition3: {
            classes: 'zoomIn',
            duration: 1000,
            delay: 400
        },
        transition4: {
            classes: 'fadeInUp',
            duration: 1000,
            delay: 600
        },
        transition5: {
            classes: 'zoomIn',
            duration: 1000,
            delay: 800
        },
        transition6: {
            classes: 'fadeInUp',
            duration: 1000,
            delay: 1000
        },
        page01: {
            show: false,
        },
        page02: {
            show: false,
        },
        page03: {
            show: true,
        }
    }
})