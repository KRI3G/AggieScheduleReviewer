const fs = require("fs");

const anex_data = loadJSON('../data/anex_data.json');
const schedule_data = loadJSON('../data/schedule.json');

async function loadJSON(file){
  try{
    fs.readFile(file, (err, data) => {
    if (err) {
      console.error('Error:', err);
    } else {
      const jsonString = data.toString('utf8');
      const jsonData = JSON.parse(jsonString);
      return jsonData;
    }
});
  }catch(err){
    console.error("error parsing JSON file: ", err);
  }
}

const classes = schedule_data["data"];
console.log(anex_data);
