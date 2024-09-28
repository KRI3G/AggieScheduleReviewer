const puppeteer = require('puppeteer');

const scrape = (async (dept, number) => {
    //example: 
    //const dept = "ENGR";
    //const number = 102;

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(`https://anex.us/grades/?dept=${dept}&number=${number}`);

    // Wait for the table to load if it is loaded dynamically
    await page.waitForSelector('tr');
    await page.waitForSelector('td');

    const data = [];
    // Grab the HTML content of the table
    const header_row = await page.$eval('#tableDiv thead tr', el => el.innerHTML);
    const headers = header_row.split("</td><td>");
    let n = headers.length;
    headers[0] = headers[0].substring(4);
    headers[n-1] = headers[n-1].substring(0,headers[n-1].length-5);
    data.push(headers);
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
        data.push(row);
    });
    console.log(data[0]);
    browser.close();
});