/*
export function pColor (color) {
    const p = document.querySelector('p');
    p.style.color = color;
};*/

$('document').ready(function(){
    const p = function pColor(color){
        $("p").css("color", color);
    }
});

export {p};
