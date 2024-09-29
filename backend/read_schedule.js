const pdf = require('pdf2json')
let data = []
const pdfParser = new pdf();
function militaryTimeToMinutes(time) {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(":").map(Number);
  
    // Calculate the total minutes
    const totalMinutes = hours * 60 + minutes;
  
    return totalMinutes;
  }

function getSchedule(data) {
    const schedule = {"M": [], "T": [], "W": [], "R": [], "F": []}
    data.forEach(cl => {
        console.log(cl)
        cl.dates.forEach(date => {
            date.days.forEach(day => {
                schedule[day].push({class: cl.name, timeStart: date.timeStart, timeEnd: date.timeEnd})
            })
        })
    })

    console.log(schedule)
    Object.keys(schedule).forEach(d => {
      schedule[d].sort((a, b) => militaryTimeToMinutes(a.timeStart) - militaryTimeToMinutes(b.timeStart));
    })

    return {schedule: schedule, classes: data}
}

function parsePDF(pdf) {
    return new Promise((resolve, reject) => {
        pdfParser.parseBuffer(pdf);
        pdfParser.on("pdfParser_dataError", (errData) =>
            console.error(errData.parserError)
           );

        pdfParser.on("pdfParser_dataReady", async (pdfData) => {
            
            try {
                let i = 10; // Actual data starts at index of 10
                let template = {class: {dept: "", num: "", section: "", full: ""}, name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", days: [], timeStart: "", timeEnd: "", building: {name: "", room: "", type: ""}}]};
                const template_keys = Object.keys(template);
                let j = 0;
                let datastr = "";
                console.log(pdfData.Pages[1].Texts.map(x => x.R[0]))
                while (i < pdfData.Pages[1].Texts.length) { // The table of schedules is on the second page
                    const text = pdfData.Pages[1].Texts[i].R[0].T;
                    datastr += text;
                    if (!text.endsWith("%20")) {
                        console.log(datastr)
                        let decoded = decodeURIComponent(datastr);
                        
                        if (template_keys[j] === "dates") {
                            if (datastr.startsWith("Date")) {
                                template["dates"][0]["date"] = decoded.split("Date: ")[1];
                            } else if (datastr.startsWith("Days")) {
                                const daysRegex = /(?<=Days:\s*)[A-Z ]+(?=\s*Time)|(?<=Days:)[A-Z ]/
                                const daysMatch = decoded.match(daysRegex);
                                
                                const timeRegex = /(?<=Time:\s*)\d{2}:\d{2} - \d{2}:\d{2}/;
                                const timeMatch = decoded.match(timeRegex);

                                template["dates"][0]["days"] = daysMatch[0].trim().split(" ");
                                template["dates"][0]["timeStart"] = timeMatch[0].split(" - ")[0];
                                template["dates"][0]["timeEnd"] = timeMatch[0].split(" - ")[1];
                            } else if (datastr.startsWith("Building")) {
                                const buildingRegex = /(?<=Building:\s*)[A-Z]+/;
                                const buildingMatch = decoded.match(buildingRegex);

                                const roomRegex = /(?<=Room: )[A-Z0-9]+(?= \()/;
                                const roomMatch = decoded.match(roomRegex);
                                
                                const typeRegex = /(?<=\()\w+(?=\))/;
                                const typeMatch = decoded.match(typeRegex);

                                template["dates"][0]["building"]["name"] = buildingMatch[0].trim();
                                template["dates"][0]["building"]["room"] = roomMatch[0];
                                template["dates"][0]["building"]["type"] = typeMatch[0];

                                if ((i + 1 < pdfData.Pages[1].Texts.length) && (pdfData.Pages[1].Texts[i + 1].R[0].T.startsWith("Date"))) {
                                    template["dates"].unshift({date: "", days: [], timeStart: "", timeEnd: "", building: {name: "", room: "", type: ""}});
                                } else {
                                    j++;
                                }
                            }
                            j--;
                        } else if (template_keys[j] === "class") {
                            const split_class = decoded.split("-");
                            template["class"]["dept"] = split_class[0];
                            template["class"]["num"] = split_class[1];
                            template["class"]["section"] = split_class[2];
                            template["class"]["full"] = decoded;
                        } else if ((template_keys[j] == "name" || template_keys[j] == "prof") && decoded.endsWith("-")) {
                            template[template_keys[j]] = decoded + pdfData.Pages[1].Texts[i + 1].R[0].T;
                            i++
                        } else {
                            template[template_keys[j]] = decoded;
                        }
                        j++;
                        datastr = "";

                        if (j === template_keys.length) {
                            console.log(data)
                            data.push(template);
                            template = {class: {dept: "", num: "", section: "", full: ""}, name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", building: {name: "", room: "", type: ""}}]};
                            j = 0;
                        }
                    }
                    i++;
                }
               
                datastr = ""
                i = 0
                j = 0
                data = getSchedule(data)

                data = await require('./anex_schedule_parser').get_grades(data)
                data.user_name = template.campus
                data.semester = decodeURIComponent(pdfData.Pages[1].Texts[0].R[0].T + pdfData.Pages[1].Texts[1].R[0].T)
                resolve(data); // Resolve the promise with the parsed data
                data = []
            } catch (error) {
                reject(error); // Reject the promise if any error occurs
                data = []
            }
        });
    });
}
  
module.exports = {
    parsePDF
};