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
    let suffix = hour < 12 ? "am" : "pm";
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}${suffix}`;
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

    if (times.length == 0) {
        return "There is no good way to catch multiple fish at once.";
    } else {
        output = `Catch multiple fish:`;
        for (let i = 0; i < Math.min(3, times.length); i++) {
            output += `<br><b>${formatHour(times[i][0])}</b>: <i>${formatList(times[i][1])}</i> -> <i>${formatFish(times[i][2])}</i>`
        }
        return output;
    }
}

function main() {
    const url = new URL(window.location.href);
    const inputs = url.searchParams.get('input').split("\n");

    var allfish = [];

    fishList.forEach(fish => {
        var bestSim = 0;
        inputs.forEach(element => {
            sim = diceCoefficient(element, fish);
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
        filename = fish.replace(new RegExp("[ \\-']", 'g'), '').toLowerCase()+".png"

        document.getElementById(`f${index}i`).src = `fish/${filename}`;
    }

    document.getElementById("reccomendation").innerHTML = bestTime(foundfish);
}