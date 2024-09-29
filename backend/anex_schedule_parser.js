const fs = require("fs").promises;
const fetch = require('node-fetch');

async function loadJSON(filePath) {
  try{
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  }catch(error){
    console.error("Error reading JSON file:", error);
  }
}

async function get_grades(schedule_data){
  const promises = schedule_data.classes.map(async (class_data, i) => {
    const dept = class_data["class"]["dept"];
    const number = class_data["class"]["num"];
    const section = class_data["class"]["section"];
    const full = class_data["class"]["full"];
    const instructor_pre = class_data["prof"].split(" ");
    const instructor = instructor_pre[1].toUpperCase() + " " + instructor_pre[0].substring(0, 1);

    try {
      const params = new URLSearchParams();
      params.append('dept', dept);
      params.append('number', number);

      const response = await fetch('https://anex.us/grades/getData/?', {
        method: 'POST',
        body: params,
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
        }
      });

      const anex_data = await response.json();

      let gpa_sum = 0;
      let classes = 0;
      let a_sum = 0;
      let n_students = 0;
      const analytics = {
        "Average_GPA": "",
        "A_percentage": "",
        "Total_Students_Taught": ""
      };

      const past_classes = [];
      const filters = ["A", "B", "C", "D", "F", "I", "Q", "S", "U", "X"];

      const new_list = anex_data.classes.filter(data => instructor == data.prof);

      if (new_list.length === 0) {
        console.log('zero length');
        schedule_data.classes[i]["grades"] = {
          "data_available": false
        };
        return;
      }

      for (const professor_class_analytics of new_list) {
        gpa_sum += Number(professor_class_analytics["gpa"]);
        a_sum += Number(professor_class_analytics["A"]);
        classes++;

        for (const filter of filters) {
          n_students += Number(professor_class_analytics[filter]);
        }
        past_classes.push(professor_class_analytics);
      }
      //console.log(past_classes);
      past_classes.splice(2);

      analytics["Average_GPA"] = gpa_sum / classes;
      analytics["A_percentage"] = (a_sum / n_students) * 100;
      analytics["Total_Students_Taught"] = n_students;

      schedule_data.classes[i]["grades"] = {
        "data_available": true,
        "data": analytics,
        "past_classes": past_classes
      };

    } catch (error) {
      console.error("Error while grabbing JSON: ", error);
      schedule_data.classes[i]["grades"] = {
        "data_available": false
      };
    }
  });
  await Promise.all(promises);
  console.log(schedule_data)
  return schedule_data;
}

module.exports = {
  get_grades
};
