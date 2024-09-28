const fs = require("fs").promises;
const fetch = require('node-fetch')
const scraper = require("./webscrapper.js");

async function loadJSON(filePath) {
  try{
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  }catch(error){
    console.error("Error reading JSON file:", error);
  }
}

async function main(){
  const schedule_data_pre = await loadJSON('../data/schedule.json');
  const schedule_data = schedule_data_pre["data"];
  const full_data = {};

  for(class_data of schedule_data){
    const dept = class_data["class"]["dept"];
    const number = class_data["class"]["num"];
    const section = class_data["class"]["section"];
    const full = class_data["class"]["full"];
    const instructor_pre = class_data["prof"].split(" ");
    const instructor = instructor_pre[1].toUpperCase() + " " + instructor_pre[0].substring(0,1);
    //console.log(instructor);

    try{
      const body = {dept: dept, number: number}
      const params = new URLSearchParams();
      params.append('dept', dept);
      params.append('number', number)
      const response = await fetch('https://anex.us/grades/getData/?', {method: 'POST', body: params, headers: {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"}})
      const anex_data = await response.json()
      console.log(anex_data)
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
      let gpa_sum = 0;
      let classes = 0;
      let a_sum = 0; 
      let n_students = 0;
      const analytics = {
        "Average_GPA": "", //gpa_sum/classes
        "A_percentage": "", //a_sum / n_students
        "Total_Students_Taught": "",

      };
      const past_classes = []; //2d array for all classes
      const filters = ["A","B","C","D","F","I","Q","S","U","X"];
      console.log("searching for prof: " + instructor + ` in class ${dept}-${number}-${section}`);
      //console.log(anex_data);
      for(professor_class_analytics of anex_data.classes){
        //alternatively throw into hm and query that way, probably way faster
        console.log(instructor)
        console.log(professor_class_analytics["Prof"])
        if(instructor != professor_class_analytics["Prof"]){
          //console.log("skipping: ", instructor, " vs ", professor_class_analytics["Prof"]);
          continue;
        }
        console.log("matched: ", instructor, " vs ", professor_class_analytics["Prof"]);
        gpa_sum += Number(professor_class_analytics["GPA"]);
        a_sum += Number(professor_class_analytics["A"]);
        classes++;
        for(const filter of filters){
          n_students += Number(professor_class_analytics[filter]);
        }
        past_classes.push(professor_class_analytics);
      }
      analytics["Average_GPA"] = gpa_sum/classes;
      analytics["A_percentage"] = (a_sum/n_students) * 100;
      analytics["Total_Students_Taught"] = n_students;
      const object = {
        "analytics" : analytics,
        "past_classes" : past_classes,
      }
      full_data[full] = object;
      //full_data.push(past_classes);
    }catch(error){
      console.error("Error processing class data: ", error);
    }
    const full_data_JSON = JSON.stringify(full_data, null, 2);
    fs.writeFile("../data/advanced_analytics.json", full_data_JSON, (err) => {
      if(err) { 
        console.error("Error writing JSON object to file", err);
      }
    });
  };
}

main();
