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
    let template = {dept: "", name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", day_time: ""}], building_name: ""}
    const template_keys = Object.keys(template)
    let j = 0
    let datastr = ""
    while (i < pdfData.Pages[1].Texts.length) { // The table of schedules is on the second page;
        const text = pdfData.Pages[1].Texts[i].R[0].T
       
        
        

        datastr += text
        
        if (!text.endsWith("%20")) {
            if (template_keys[j] == "dates") { // Handle for certain dates
                
            }
            template[template_keys[j]] = decodeURIComponent(datastr)
            console.log(template_keys[j])
            j++
            datastr = ""
            
            if (j == template_keys.length) {
                data.push(template)
                console.log(template)
                template = {dept: "", name: "", campus: "", hours: 0, id: "", prof: "", dates: [{date: "", day_time: ""}], building_name: ""}
                j = 0
             }
        }
        i++
    }
    console.log(data)
})   
  
    

pdfParser.loadPDF("./schedule.pdf");
