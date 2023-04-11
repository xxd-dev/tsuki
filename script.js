const fishList = getFishList();
const fishDict = getFishData();
const url = new URL(window.location.href);

function main() {
    const url = new URL(window.location.href);
    if (url.searchParams.has("input")) {
        let inputs = url.searchParams.get('input');
        forward("fish/index.html?input="+encodeURIComponent(inputs));
    }

    var acc = document.getElementsByClassName("accordion");
    var i;

    acc[0].classList.toggle("active");
    var panel = acc[0].nextElementSibling;
    panel.style.maxHeight = panel.scrollHeight + "px";

    for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        // Collapse the section if it is already open
        if (this.classList.contains("active")) {
        this.classList.remove("active");
        var panel = this.nextElementSibling;
        panel.style.maxHeight = null;
        // Close all other collapsibles
        var j;
        for (j = 0; j < acc.length; j++) {
            if (j !== i) {
            acc[j].classList.remove("active");
            var panel = acc[j].nextElementSibling;
            panel.style.maxHeight = null;
            }
        }
        } else {
        // Close all other collapsibles
        var j;
        for (j = 0; j < acc.length; j++) {
            if (j !== i) {
            acc[j].classList.remove("active");
            var panel = acc[j].nextElementSibling;
            panel.style.maxHeight = null;
            }
        }
        // Open the clicked section
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + "px";
        
        }
    });
    }

    const d = new Date();
    let hour = d.getHours();

    document.getElementById("times").value = ""+hour
}

function timeloc() {
    console.log("time loc");
    loc = document.getElementById("locations").value;
    time = document.getElementById("times").value;
    forward("location/index.html?loc="+loc+"&time="+time);
}

function fish() {
    console.log("fish/");
    params = document.getElementById("fish").value;
    if (params != "") {
        forward("fish/index.html?input="+encodeURIComponent(params.replace(",", "\n")));
    }
}

function forward(appendix) {
    let url = window.location.href;
    let index = url.lastIndexOf("/");
    let new_url = url.substring(0, index + 1);
    console.log(new_url + appendix)
    window.location.href = new_url + appendix;
}
