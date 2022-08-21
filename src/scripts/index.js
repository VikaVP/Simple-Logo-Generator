import '../styles/main.css';
import { changeColor, changeSize, changeText, selectDecoration, closeModal, saveImage, splitText, debounce } from './utils';


const inputText = document.getElementById('input-text');
const inputSize = document.getElementById('change-size');
const pickColor = document.querySelectorAll('.pick-color');
const pickDecoration = document.querySelectorAll('.pick-decoration')
const saveBtn = document.getElementById('btn-save');
const closeBtn = document.getElementById('btn-close')
const iconProgress = document.querySelector('.icon-progress');

// register the effect with GSAP:
gsap.registerEffect({
    name: "fade",
    effect: (targets, config) => {
        return gsap.to(targets, { duration: config.duration, opacity: 0 });
    },
    defaults: { duration: 2 },
    extendTimeline: true,
});

gsap.registerEffect({
    name: "scrambleSplit",
    plugins: "scrambleText",
    defaults: { scrambleText: "{original}" },
    extendTimeline: true,
    effect(splits, vars) {
        let tl = gsap.timeline();
        splits.forEach(split => {
            let proxy = document.createElement("div"),
                chars = split.chars,
                l = chars.length;
            proxy.innerText = split.chars.map(e => e.innerText).join("");
            tl.add(gsap.to(proxy, vars).eventCallback("onUpdate", () => {
                let i = l;
                while (i--) {
                    chars[i].innerText = proxy.innerText.charAt(i);
                }
            }), 0);
        });
        return tl;
    }
});

inputSize.addEventListener('change', changeSize)
saveBtn.addEventListener('click', saveImage)
closeBtn.addEventListener('click', closeModal)


const debouncedText = debounce(changeText, 500);
inputText.addEventListener('keyup', (e) => {
    iconProgress.classList.add('animate-ping')
    debouncedText(e)

})

splitText()

for (const pc of pickColor) {
    pc.addEventListener('click', changeColor)
}

for (const pe of pickDecoration) {
    pe.addEventListener('click', selectDecoration)
}