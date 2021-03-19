{{ if .Site.Params.ModeSwitcher }}
function setMode(trainingMode){
    document.querySelectorAll("details").forEach(details => {
        // only open detail elements with data-mode="expertmode" attributes
        if(details.getAttribute("data-mode") === "normalexpertmode"){
            if(trainingMode === "expert"){
                details.removeAttribute("open");
            }else{
                details.setAttribute("open", "true");
            }
        }
    });
}

// add expertmodeswitcher to navigation
var str = '<li class="nav-item mr-4 mb-2 mb-lg-0"><label class="switch"><input type="checkbox" class="modeswitcher"><span class="slider"></span></label></li>',
  div = document.getElementById('main_navbar');
div.querySelector("ul").insertAdjacentHTML("afterbegin", str);

var trainingMode = (localStorage.getItem('trainingMode') === undefined) ? "normal" : localStorage.getItem('trainingMode');
localStorage.setItem('trainingMode', trainingMode);
document.querySelectorAll(".modeswitcher").forEach(checkbox => {
    checkbox.checked = (trainingMode === "expert");
});

window.addEventListener('load', (event) => {
    document.querySelectorAll(".modeswitcher").forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                localStorage.setItem('trainingMode', "expert");
                setMode("expert");
            } else {
                localStorage.setItem('trainingMode', "normal");
                setMode("normal");
            }
        });
    });
    setMode(trainingMode);
});
{{end}}