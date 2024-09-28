const fs = require("fs");

const anex_data = loadJSON('../data/anex_data.json');
const schedule_data = loadJSON('../data/schedule.json');

async function loadJSON(file){
  try{
    const json_string = await fs.readFile(file, 'utf8');
    const data = JSON.parse(json_string);
    return data;
  }catch(err){
    console.error("error parsing JSON file: ", err);
  }
}

const classes = schedule_data["data"];
console.log(classes);
