import "regenerator-runtime";
import { Draggable } from '../plugin/Draggable.min.js';
import SplitType from 'split-type'
import { elementToSVG, inlineResources } from 'dom-to-svg'


const textSize = document.getElementById('text-size');
const draggableWord = document.querySelector('.draggable-word');
const modalSave = document.getElementById('modalSave');
const iconProgress = document.querySelector('.icon-progress');
const pickColor = document.querySelectorAll('.pick-color');
const pickDecoration = document.querySelectorAll('.pick-decoration')

export const changeSize = (e) => {
    let val = `${e.target.value}px`
    let chars = document.querySelectorAll('.char');
    textSize.innerHTML = val
    Array.from(chars).map(char => char.style["font-size"] = val)
}

export const changeText = async (e) => {
    let val = e.target.value
    // iconProgress.classList.add('animate-ping')
    SplitType.revert('.draggable-word')
    draggableWord.innerHTML = await val
    // setTimeout(() => {
    splitText()
    iconProgress.classList.remove('animate-ping')
    // }, 400);
}

export const changeColor = (e) => {
    let colorText = e.currentTarget.dataset.bg
    let chars = document.querySelectorAll('.char');
    Array.from(chars).map(char => char.style["color"] = colorText)
    Array.from(pickColor).map(pc => pc.classList.remove("active-color"))
    e.currentTarget.classList.add("active-color")
}

let prevDeco = 'none'

export const selectDecoration = (e) => {
    let classDeco = e.currentTarget.dataset.var;
    let chars = document.querySelectorAll('.char');

    Array.from(chars).map(char => (
        char.classList.remove(prevDeco),
        char.classList.add(classDeco)
    ))
    Array.from(pickDecoration).map(pd => pd.classList.remove("active-color"))

    prevDeco = classDeco;
    e.currentTarget.classList.add("active-color")
}

export const closeModal = () => {
    modalSave.style.opacity = '1';
    modalSave.style.top = '-100%';
}

export const saveImage = async () => {
    const svgDocument = elementToSVG(document.querySelector('.draggable-word'))
    const canvas = document.querySelector('canvas');
    modalSave.style.position = 'fixed';
    modalSave.style.opacity = '1';
    modalSave.style.top = '10%';

    // Inline external resources (fonts, images, etc) as data: URIs
    await inlineResources(svgDocument.documentElement)

    // Get SVG string
    const svgString = new XMLSerializer().serializeToString(svgDocument)
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    const img = new Image();
    const svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);
    img.onload = function () {
        ctx.drawImage(img, canvas.width / 2 - img.width / 2,
            canvas.height / 2 - img.height / 2);
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

export const splitText = () => {
    let text = SplitType.create('.draggable-word')
    gsap.effects.scrambleSplit(text, { duration: 2 });
    gsap.from(text.chars, { duration: 0.5, y: "random(-100, 100)", x: "random(-50, 50)", stagger: 0.05 })
    Draggable.create(".char", {
        type: "x,y",
        bounds: "html",
        inertia: true
    });
    // cb()
}

export const debounce = (func, wait = 100) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
