const pdf = require('pdf2json')
let data = []
const pdfParser = new pdf();


function parsePDF(pdf) {
    return new Promise((resolve, reject) => {
        pdfParser.parseBuffer(pdf);
        pdfParser.on("pdfParser_dataError", (errData) =>
            console.error(errData.parserError)
           );

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            try {
                let i = 10; // Actual data starts at index of 10
                let template = {class: {dept: "", num: "", section: "", full: ""}, name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", days: [], timeStart: "", timeEnd: "", building: {name: "", room: "", type: ""}}]};
                const template_keys = Object.keys(template);
                let j = 0;
                let datastr = "";
                
                while (i < pdfData.Pages[1].Texts.length) { // The table of schedules is on the second page
                    const text = pdfData.Pages[1].Texts[i].R[0].T;
                    datastr += text;

                    if (!text.endsWith("%20")) {
                        let decoded = decodeURIComponent(datastr);
                        if (template_keys[j] === "dates") {
                            if (datastr.startsWith("Date")) {
                                template["dates"][0]["date"] = decoded.split("Date: ")[1];
                            } else if (datastr.startsWith("Days")) {
                                const daysRegex = /(?<=Days: )[A-Z ]+(?= Time)/;
                                const daysMatch = decoded.match(daysRegex);
                                
                                const timeRegex = /(?<=Time: )\d{2}:\d{2} - \d{2}:\d{2}/;
                                const timeMatch = decoded.match(timeRegex);

                                template["dates"][0]["days"] = daysMatch[0].trim().split(" ");
                                template["dates"][0]["timeStart"] = timeMatch[0].split(" - ")[0];
                                template["dates"][0]["timeEnd"] = timeMatch[0].split(" - ")[1];
                            } else if (datastr.startsWith("Building")) {
                                const buildingRegex = /(?<=Building:)[A-Z]+/;
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
                        } else {
                            template[template_keys[j]] = decoded;
                        }
                        j++;
                        datastr = "";

                        if (j === template_keys.length) {
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