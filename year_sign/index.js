Vue.use(VAnimateCss.default);

var vm = new Vue({
    el: '#app',
    data() {
        return {
            page01: {
                show: false,
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
                transition7: {
                    classes: 'zoomIn',
                    duration: 1000,
                    delay: 1200
                }
            },
            page02: {
                show: true,
                // transition1: {
                //     classes: 'slideInDown',
                //     duration: 1000,
                //     delay: 0,
                // },
                // transition2: {
                //     classes: 'zoomIn',
                //     duration: 1000,
                //     delay: 200
                // },
                // transition3: {
                //     classes: 'zoomIn',
                //     duration: 1000,
                //     delay: 400
                // },
                // transition4: {
                //     classes: 'fadeInUp',
                //     duration: 1000,
                //     delay: 600
                // }
            }
        }
    }
})