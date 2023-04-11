const fishList = getFishList();
const fishDict = getFishData();

function formatHour(hour) {
    const emojis = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
    var emoji = emojis[hour % 12];
    let suffix = hour < 12 ? "am" : "pm";
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${emoji} ${String(hour).padStart(2, '0')}:00 ${suffix}`;
}

function main() {
    const url = new URL(window.location.href);
    if (url.searchParams.has("loc") && url.searchParams.has("time")) {
        var loc = url.searchParams.get('loc')
        var time = url.searchParams.get('time')
        if (!['ocean', 'river', 'pond'].includes(loc)) {
            forward();
        }
        var number = Number(time);
        if (!(!isNaN(number) && Number.isInteger(number) && number >= 0 && number <= 23)) {
            forward()
        }
        findfish(loc, number);
    } else {
        forward();
    }
}

function findfish(loc, time) {
    possible = [];
    fishList.forEach(fish => {
        if (fishDict[fish]["times"][loc][time] == "1") {
            possible.push(fish);
        }
    })

    document.getElementById("fishcontainer").innerHTML += `<pre>
${formatHour(time)}, ${loc}:</pre>`

    possible = possible.sort((a, b) => 
        fishDict[a]["worth"] - fishDict[b]["worth"]
    )
    for (let i = 0; i < possible.length; i++) {
        var fish = possible[i];
        document.getElementById("fishcontainer").innerHTML += `
        <div class="fish">
                <div class="paper">
                <div class="ear">
                    <p class="reward" id="f2r"></p><p id="f2b">${fishDict[fish]["worth"]}</p>
                    <img src="../assets/carrot.png" alt="carrots">
                </div>
                    <div class="dotted">
                        <div class="head">
                            <div class="imgcontainer">
                                <img id="f2i" src="../assets/${fishDict[fish]["img"]}" alt="placeholder" class="icon">
                            </div>
                            <p id="f2t">${fish}</p>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

function forward() {
    let url = window.location.href;
    let index = url.lastIndexOf("/", url.lastIndexOf("/") - 1);
    let new_url = url.substring(0, index + 1);
    window.location.replace(new_url);
}