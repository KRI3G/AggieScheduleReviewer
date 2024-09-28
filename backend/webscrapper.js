const puppeteer = require('puppeteer');
const fs = require('fs');

const scrape = (async (dept, section, honors) => { //honors is T/F
    //example: 
    //const dept = "ENGR";
    //const number = 102;
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(`https://anex.us/grades/?dept=${dept}&number=${section}`);
    try{

        // Wait for the table to load if it is loaded dynamically

        const chart_check = await page.$eval('#chartDiv', el => el.innerHTML)
        if(chart_check.includes("No data returned. Is your input correct?")){
            throw new Error(`No data for section: ${section} in this department: ${dept}.`);
        }

        await page.waitForSelector('tr');
        await page.waitForSelector('td');

        const data = [];
        // Grab the HTML content of the table
        const header_row = await page.$eval('#tableDiv thead tr', el => el.innerHTML);
        const headers = header_row.split("</td><td>");
        let n = headers.length;
        headers[0] = headers[0].substring(4);
        headers[n-1] = headers[n-1].substring(0,headers[n-1].length-5);
        //data.push(headers);
        //console.log(headers);
        
        const table = await page.$eval('#tableDiv tbody', el => el.innerHTML);
        const rows = table.split("</tr><tr>");
        let n2 = rows.length;
        rows[0] = rows[0].substring(4);
        rows[n2-1] = rows[n2-1].substring(0,rows[n2-1].length-5);
        //console.log(rows);
        rows.forEach((row_pre, index) => {
            const row = row_pre.split("</td><td>");
            let n3 = row.length;
            row[0] = row[0].substring(4);
            row[n3-1] = row[n3-1].substring(0,row[n3-1].length-5);

            const merge = headers.reduce((obj, key, index) => {
                obj[key] = row[index];
                return obj;
            }, {});
            if(honors == merge['Prof'].includes('(H)')){
                data.push(merge);
            }
        });

        const json_object_pre = data.reduce((object, item, index) => {
            object[index] = item;
            return object;
        });
        const json_object = JSON.stringify(json_object_pre, null, 2);

        fs.writeFile('../data/anex_data.json', json_object, (err) => {
            if(err) { 
                console.error("Error writing JSON object to file", err);
            }else{
                console.log("JSON data successfully written to file!");
            }
    });
    }catch(error){
        //console.error("error: ", error);
        console.error(`No data for section: ${section} in this department: ${dept}, with honors flag ${honors}\n\n`, error);
    }finally {
        await browser.close();
        console.log("Broswer closed.");
    }
});

scrape("MEEN", 210, true);