<template>
    <span class="p-2">&nbsp;
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            class="tronFilter"
        >
            <circle cx="50" cy="50" r="45" :stroke="color" />
        </svg>
    </span>
</template>

<script>
export default {
    name: "Loading",
    props: {
        color: {
            required: false,
            default: () => 'black'
        }
    }
}
</script>

<style lang="scss" scoped>
svg {
    animation: 800ms linear infinite svg;
    height: 60%;
    width: 100%;
    position: absolute;
    display: block;
    top: 20%;
    left: 0;

    circle {
        animation: 800ms ease-in-out infinite both circle;
        display: block;
        fill: transparent;
        stroke-linecap: round;
        stroke-dasharray: 283;
        stroke-dashoffset: 280;
        stroke-width: 10px;
        transform-origin: 50% 50%;
    }
}

@keyframes svg {
    0% {
        transform: rotateZ(0deg);
    }

    100% {
        transform: rotateZ(360deg);
    }
}

@keyframes circle {
    0%, 25% {
        stroke-dashoffset: 280;
        transform: rotate(0);
    }

    50%, 75% {
        stroke-dashoffset: 75;
        transform: rotate(45deg);
    }

    100% {
        stroke-dashoffset: 280;
        transform: rotate(360deg);
    }
}
</style>
