addListeners();

function animaster() {
    function resetFadeIn(element) {
        element.classList.add('hide');
        element.classList.remove('show');
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }

    function resetMoveAndScale(element) {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }

    return {
        _steps: [],
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },
        moveAndHide(element, duration, translation) {
            this.addMove(duration * 2 / 5, translation)
                .addDelay(duration * 2 / 5)
                .addFadeOut(duration * 3 / 5)
                .play(element, false);
            return {
                reset() {
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            }
        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },
        heartBeating(element, duration) {
            const halfTime = duration * 0.5;
            this.addScale(halfTime, 1.4)
                .addScale(halfTime, 1)
                .play(element, true);
            // return {
            //     stop: function () {
            //         document.getElementById('heartBeatingPlay').disabled = false;
            //         clearInterval(growTimer);
            //     }
            // };
        },
        addMove(duration, translation) {
            this._steps.push({
                name: "move",
                duration: duration,
                arg: translation
            });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                name: "scale",
                duration: duration,
                arg: ratio
            });
            return this;
        },
        addFadeIn(duration, ratio) {
            this._steps.push({
                name: "fadeIn",
                duration: duration
            });
            return this;
        },
        addFadeOut(duration, ratio) {
            this._steps.push({
                name: "fadeOut",
                duration: duration
            });
            return this;
        },
        addDelay(duration) {
            this._steps.push({name: 'delay', duration: duration})
            return this;
        },
        play(element, cycled) {
            let currentDelay = 0;
            for (const step of this._steps) {
                const stepDelay = currentDelay;
                switch (step.name) {
                    case "move":
                        setTimeout(() => this.move(element, step.duration, step.arg), stepDelay)
                        break;
                    case "scale":
                        setTimeout(() => this.scale(element, step.duration, step.arg), stepDelay);
                        break;
                    case "fadeIn":
                        setTimeout(() => this.fadeIn(element, step.duration), stepDelay);
                        break;
                    case "fadeOut":
                        setTimeout(() => this.fadeOut(element, step.duration), stepDelay);
                        break;
                    case "delay":
                        break;
                }
                currentDelay += step.duration;
            }
            setInterval(() => this.play(element, false), currentDelay);
        }
    }
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block, false);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block, false);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block, false);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block, false);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const resetable = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
            document.getElementById('moveAndHideReset').addEventListener('click', resetable.reset);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            document.getElementById('heartBeatingPlay').disabled = true;
            const block = document.getElementById('heartBeatingBlock');
            const stoppable = animaster().heartBeating(block, 1000);
            document.getElementById('heartBeatingStop').addEventListener('click', stoppable.stop);
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

//animaster().scale(element, 500, .8)
