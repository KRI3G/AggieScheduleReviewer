const pdf = require('pdf2json')

const pdfParser = new pdf();

function getText(pdfData, i) { // To get text collection much less tedious
    return decodeURI
}

pdfParser.on("pdfParser_dataError", (errData) =>
 console.error(errData.parserError)
);

pdfParser.on("pdfParser_dataReady", (pdfData) => {
    const data = []
    let i = 10 // Actual data starts at index of 10
    let template = {class: {dept: "", num: "", section: "", full: ""}, name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", days: [], timeStart: "", timeEnd: "", building: {name: "", room: "", type: ""}}]}
    const template_keys = Object.keys(template)
    let j = 0
    let datastr = ""
    while (i < pdfData.Pages[1].Texts.length) { // The table of schedules is on the second page;
        const text = pdfData.Pages[1].Texts[i].R[0].T
        datastr += text
        
        if (!text.endsWith("%20")) {
            let decoded = decodeURIComponent(datastr)
            if (template_keys[j] == "dates") { // Handle for multiple dates
                if (datastr.startsWith("Date")) {
                    template["dates"][0]["date"] = decoded.split("Date: ")[1]
                } else if (datastr.startsWith("Days")) {

                    const daysRegex = /(?<=Days: )[A-Z ]+(?= Time)/; // Get M W F
                    const daysMatch = decoded.match(daysRegex);
                    
                    const timeRegex = /(?<=Time: )\d{2}:\d{2} - \d{2}:\d{2}/; // Get 12:00 - 12:50 
                    const timeMatch = decoded.match(timeRegex);

                    template["dates"][0]["days"] = daysMatch[0].trim().split(" ") // Split it into ["M", "W", "F"]
                    template["dates"][0]["timeStart"] = timeMatch[0].split(" - ")[0] 
                    template["dates"][0]["timeEnd"] = timeMatch[0].split(" - ")[1]

                } else if (datastr.startsWith("Building")) { 

                    const buildingRegex = /(?<=Building:)[A-Z]+/;
                    const buildingMatch = decoded.match(buildingRegex); // ILCB

                    const roomRegex = /(?<=Room: )[A-Z0-9]+(?= \()/;
                    const roomMatch = decoded.match(roomRegex); // 111
                    

                    const typeRegex = /(?<=\()\w+(?=\))/;
                    const typeMatch = decoded.match(typeRegex); // LEC, SEM, or LAB

                    template["dates"][0]["building"]["name"] = buildingMatch[0].trim() 
                    template["dates"][0]["building"]["room"] = roomMatch[0]
                    template["dates"][0]["building"]["type"]= typeMatch[0]


                    if ((i + 1 < pdfData.Pages[1].Texts.length) && (pdfData.Pages[1].Texts[i + 1].R[0].T.startsWith("Date"))) { // Checks if the next data point is another date
                        template["dates"].unshift({date: "", days: [], timeStart: "", timeEnd: "", building: {name: "", room: "", type: ""}}) // Add a new date
                        // Add to the beginnig
                    } else {
        
                        j++
                    }
                }
                j--
            } else if (template_keys[j] == "class") {
                split_class = decoded.split("-")
                template["class"]["dept"] = split_class[0] // CHEM
                template["class"]["num"] = split_class[1] // 107
                template["class"]["section"] = split_class[2] // Section #
                template["class"]["full"] = decoded 
            } else {
                template[template_keys[j]] = decoded // Any other
            }
            j++
            datastr = ""
            
            if (j == template_keys.length) {
                data.push(template)
                console.log(template)
                template = {class: {dept: "", num: "", section: "", full: ""}, name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", building: {name: "", room: "", type: ""}}]}
                j = 0
             }
        }
        i++
    }
    require('fs').writeFileSync('../data/schedule.json', JSON.stringify({data: data}, null, 2) , 'utf-8');
})   
  
    

pdfParser.loadPDF("../data/schedule.pdf");
