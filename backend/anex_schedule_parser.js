const fs = require("fs");
console.log('exporting....');
const { scrape } = require("/Users/kingisaac/Documents/Documents - John’s MacBook Pro (2)/Github/AggieScheduleReviewer/backend/webscrapper.js");
console.log('new exporting....')

async function loadJSON(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          reject(parseError);
        }
      }
    });
  });
}
      

async function main(){
  console.log("dummy");
  const schedule_data_pre = await loadJSON('../data/schedule.json');
  const schedule_data = schedule_data_pre["data"];
  console.log("schedule_data loaded\n", schedule_data[0]);

  schedule_data.forEach(async class_data => {
    const dept = class_data["class"]["dept"];
    const number = class_data["class"]["num"];
    const section = class_data["class"]["section"];
    const instructor_pre = class_data["prof"].split(" ");
    const instructor = instructor_pre[0] + instructor_pre[1].substring(0,1);
    console.log(instructor);

    scrape(dept, number, false); //how to do honors?
    const anex_data = await loadJSON('../data/anex_data.json');

    /*
    {
    "Year": "2024",
    "Semester": "SPRING",
    "Prof": "SMITH J",
    "GPA": "3.461",
    "Section": "511",
    "A": "182",
    "B": "110",
    "C": "30",
    "D": "0",
    "F": "1",
    "I": "0",
    "Q": "5",
    "S": "0",
    "U": "0",
    "X": "0"
  },
    */
    console.log(anex_data);
    anex_data.forEach(professor_class_analytics => {
      if(instructor != professor_class_analytics["Prof"]){
        console.log("NO MATCH: ", instructor, " vs ", professor_class_analytics);
      }
      console.log("MATCH: ", instructor, " vs ", professor_class_analytics);
    });
  });
}

console.log("owo!");
main();
