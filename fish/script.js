const fishList = getFishList();
const fishDict = getFishData();

// https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Dice%27s_coefficient
function getBigrams(str) {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i += 1) {
        bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
}

function formatHour(hour) {
    const emojis = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
    var emoji = emojis[hour % 12];
    let suffix = hour < 12 ? "am" : "pm";
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${emoji} ${String(hour).padStart(2, '0')}:00 ${suffix}`;
}

function formatList(input_list) {
    return "<i>"+input_list.join('</i>, <i>')+"</i>";
}

function formatFish(input_list) {
    if (input_list.length == 3) {
        return "<i>all 3 fish</i>"
    }
    return "<i>"+input_list.join('</i>, <i>')+"</i>";
}
  
function intersect(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function pad(num, size) {
    var s = "000000000000000000000000" + num;
    return s.substring(s.length-size);
}

function diceCoefficient(str1, str2) {
    const bigrams1 = getBigrams(str1);
    const bigrams2 = getBigrams(str2);
    return (2 * intersect(bigrams1, bigrams2).size) / (bigrams1.size + bigrams2.size);
}

function bestTime(fishes) {
    times = [];
    timeslots = [];
    only_times = new Set();
    var locations = ["ocean", "river", "pond"];

    for (let hour = 0; hour < 24; hour++) {
        for (let location_index = 0; location_index < 3; location_index++) {
            var location = locations[location_index];
            if (fishes.every(fish => 
                fishDict[fish]["times"][location][hour] == "1"
            )) {
                if (!only_times.has(hour)) {
                    times.push([hour, [location], fishes]);
                    only_times.add(hour);
                }
            } 
        }

        for (let i = 0; i < 3; i++) {
            for (let j = i + 1; j < 3; j++) {
                possible = true;
                fishes.forEach(fish => {
                    if (fishDict[fish]["times"][locations[i]][hour] != "1" && fishDict[fish]["times"][locations[j]][hour] != "1") {
                        possible = false;
                    }
                })
                if (possible) {
                    if (!only_times.has(hour)) {
                        times.push([hour, [locations[i], locations[j]], fishes])
                        only_times.add(hour);
                    }
                }
            }
        }

        for (let location_index = 0; location_index < 3; location_index++) {
            var location = locations[location_index];
            if (fishes.every(fish => 
                fishDict[fish]["times"][locations[0]][hour] == "1" || fishDict[fish]["times"][locations[1]][hour] == "1" || fishDict[fish]["times"][locations[2]][hour] == "1"
            )) {
                if (!only_times.has(hour)) {
                    times.push([hour, locations, fishes]);
                    only_times.add(hour);
                }
            } 
        }
        
        for (let a = 0; a < 3; a++) {
            for (let b = a + 1; b < 3; b++) {
                sliced_fishes = [fishes[a], fishes[b]]

                for (let location_index = 0; location_index < 3; location_index++) {
                    var location = locations[location_index];
                    if (sliced_fishes.every(fish => 
                        fishDict[fish]["times"][location][hour] == "1"
                    )) {
                        if (!only_times.has(hour)) {
                            times.push([hour, [location], sliced_fishes]);
                            only_times.add(hour);
                        }
                    } 
                }

                for (let i = 0; i < 3; i++) {
                    for (let j = i + 1; j < 3; j++) {
                        possible = true;
                        sliced_fishes.forEach(fish => {
                            if (fishDict[fish]["times"][locations[i]][hour] != "1" && fishDict[fish]["times"][locations[j]][hour] != "1") {
                                possible = false;
                            }
                        })
                        if (possible) {
                            if (!only_times.has(hour)) {
                                times.push([hour, [locations[i], locations[j]], sliced_fishes])
                                only_times.add(hour);
                            }
                        }
                    }
                }

            }
        }
    }

    times.sort((a, b) => a[2].length - b[2].length || b[1].length - a[1].length || b[0]-a[0]).reverse();

    const d = new Date();
    let hour = d.getHours();

    filtered_times = times.filter(a => a[0] >= hour)
    if (filtered_times.length > 0) {
        times = filtered_times
    }

    for (let i = 0; i < times.length; i++) {
        slot = times[i];
        tmp = {};
        for (let j = 0; j < slot[1].length; j++) {
            loc = slot[1][j]
            tmp[loc] = [];
        }
        for (let j = 0; j < slot[2].length; j++) {
            f = slot[2][j];
            for (let k = 0; k < slot[1].length; k++) {
                loc = slot[1][k]
                if (fishDict[f]["times"][loc][slot[0]] == "1") {
                    tmp[loc].push(f);
                    continue;
                }
            }
        }
        slot.push(tmp);
    }

    if (times.length == 0) {
        return `<pre id="recommendation">There is no good way to catch multiple fish at once.</pre>`;
    } else {
        output = `<pre id="recommendation">Good fishing times:</pre>`;
        suggestions = `<pre id="recommendation">Good fishing times:</pre>`
        for (let i = 0; i < Math.min(3, times.length); i++) {
            //time slots
            locations = ""
            for (let j = 0; j < times[i][1].length; j++) {
                //locations
                loc = times[i][1][j];
                images = ""
                for (let k = 0; k < times[i][3][loc].length; k++) {
                    f = times[i][3][loc][k];
                    images +=  `<div class="imgcontainer2">
                                    <img src="../assets/${fishDict[f]["img"]}" alt="fish" class="icon">
                                </div>`;
                }
                locations += `<div class="locationcard${times[i][3][loc].length == 2? "":" double"}">
                <pre>${loc}</pre>
                <div>${images}</div></div>`;
            }
            suggestions += `<div class="suggestion">
            <div class="time">
                <pre>${formatHour(times[i][0])}</pre>
            </div>
            <div class="locations">${locations}</div></div>`

            output += `<br><b>${formatHour(times[i][0])}</b>: <i>${formatList(times[i][1])}</i> -> <i>${formatFish(times[i][2])}</i>`
        }
        return suggestions;
    }
}

function main() {
    const url = new URL(window.location.href);
    if (url.searchParams.has("input")) {
        const inputs = url.searchParams.get('input').split("\n");
        determineFish(inputs);
    } else {
        let url = window.location.href;
        let index = url.lastIndexOf("/", url.lastIndexOf("/") - 1);
        let new_url = url.substring(0, index + 1);
        window.location.replace(new_url);
    }
}

function determineFish(inputs) {
    var allfish = [];

    fishList.forEach(fish => {
        var bestSim = 0;
        inputs.forEach(element => {
            sim = diceCoefficient(element.toLocaleLowerCase(), fish.toLocaleLowerCase());
            if (sim > bestSim) {
                bestSim = sim;
            }
        });
        allfish.push({
            name: fish,
            sim: bestSim
        });
    });

    let foundfish = allfish.sort((x, y) => x.sim - y.sim)
        .reverse()
        .slice(0, 3)
        .map(element => element.name);

    for (let [index, fish] of foundfish.entries()) {
        document.getElementById(`f${index}t`).innerHTML = fish;
        ["ocean", "river", "pond"].forEach(element => {
            document.getElementById(`f${index}${element}`).innerHTML = fishDict[fish]["times_string"][element];
        })
        filename = fishDict[fish]["img"]
        document.getElementById(`f${index}i`).src = `../assets/${filename}`;
        document.getElementById(`f${index}b`).innerHTML = fishDict[fish]["bounty"];
        document.getElementById(`f${index}r`).innerHTML = fishDict[fish]["worth"]+"/";
    }
    document.getElementById("bottom").innerHTML = bestTime(foundfish);
}