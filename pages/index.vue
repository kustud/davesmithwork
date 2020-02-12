<template>
    <div class="wrap">
        <div class="bg"></div>
        <div class="caption">
            <span class="text-bg">&gt; Dave Smith<span class="blinking-cursor">_</span> </span> <br>
            <span class="small-text text-bg"><img class="icon" src="~assets/images/email.png"> <a href="mailto:hello@davesmith.work">hello@davesmith.work</a> <img class="icon" src="~assets/images/twitter.png"> <a href="https://twitter.com/_Dave_Smith">@_dave_smith</a></span class="bg">
        </div>
    </div>
</template>

<script>

import $ from 'jquery';

let lFollowX = 0;
let lFollowY = 0;
let x = 0;
let y = 0;
const friction = 1 / 30;
let translate;

function moveBackground() {

    x += (lFollowX - x) * friction;
    y += (lFollowY - y) * friction;

    translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

    $('.bg').css({
        '-webit-transform': translate,
        '-moz-transform': translate,
        'transform': translate
    });

    window.requestAnimationFrame(moveBackground);
}


export default {
    mounted: function () {

        $(window).on('mousemove click', function(e) {
            var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
            var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
            lFollowX = (20 * lMouseX) / 100;
            lFollowY = (10 * lMouseY) / 100;

        });

        moveBackground();
    }
}

</script>

<style>

.wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
  opacity: 0.9;
}

.section {
    min-height: 100%;
    position: relative;
    background-color: #2e2e2e;
    color: #FFFFFF;
    font-size: 14px;
}

.mugshot {
    width:200px;
}

a {
    color: #a9a9a9;
}
a:hover {
    text-decoration: none;
    color: #18b7ec;
}

.bg {
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  background: url("~assets/images/sea.jpeg") no-repeat center center;
  background-size: cover;

  transform: scale(1.1);
}

.caption {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  color: #000;
  font-family: "Noto Sans", sans-serif;
}

.text-bg {
  background-color: #111;
  color: #fff;
  border: 0px;
  padding: 18px;
  font-size: 25px;
  letter-spacing: 10px;
  line-height: 80px;
}

.caption .small-text {
    font-family: 'Roboto Mono', monospace;
    font-size: 15px;
}

.icon {
    width: 20px;
}

.blinking-cursor {
    font-weight: 100;
    font-size: 30px;
    color: #FFFFFF;
    -webkit-animation: blink 1s step-end infinite;
    animation: blink 1s step-end infinite;
}

@-webkit-keyframes blink {
    0% { opacity: 1.0; }
    50% { opacity: 0.0; }
    100% { opacity: 1.0; }
}

@keyframes blink {
    0% { opacity: 1.0; }
    50% { opacity: 0.0; }
    100% { opacity: 1.0; }
}
</style>
