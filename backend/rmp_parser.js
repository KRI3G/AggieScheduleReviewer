// Import node fetch
const fetch = require('node-fetch');
const fs = require("fs").promises;

// Test object

// Function to load JSON file in the server
async function loadJSON(filePath) {
  try{
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  }catch(error){
    console.error("Error reading JSON file:", error);
  }
}

// Function to find the RMP ID number of a given 
async function getProfId(ultimateObj, classIndex) {
	const profJSON = await loadJSON('../data/professors.json');
	//console.log(classIndex);
	//console.log(classIndex);
	const profName = ultimateObj.classes[classIndex].prof;

	for (let currentProf = 0; currentProf < profJSON.data.length; currentProf++) {
		const currentProfName = profJSON.data[currentProf].tFname + " " + profJSON.data[currentProf].tLname;
		if (currentProfName == profName) {
			return profJSON.data[currentProf].tid;
		}
	};

	// If professor not found, return blank
	return "N/A";

};

async function getProfRating(ultimateObj, classIndex) {
	const profJSON = await loadJSON('../data/professors.json');
  //console.log(classIndex);
	const profName = ultimateObj.classes[classIndex].prof;
  //console.log(ultimateObj.data[0].prof);
  //console.log(ultimateObj.data[classIndex].prof);

	for (let currentProf = 0; currentProf < profJSON.data.length; currentProf++) {
		const currentProfName = profJSON.data[currentProf].tFname + " " + profJSON.data[currentProf].tLname;
		if (currentProfName == profName) {
			return profJSON.data[currentProf].overall_rating;
		};
	};
};

// Function to get average ratings of professor
async function getRatings(professor, classIndex) {
	const professorId = await getProfId(professor, classIndex);
  const overall = await getProfRating(professor, classIndex);
	if (professorId == "N/A") {
		const output = {};
		return output;
	}
	//console.log(professorId + " professor Id")
	const rmpEndpoint = "https://www.ratemyprofessors.com/paginate/professors/ratings?tid=" + professorId + "&filter=&courseCode=&page=";

	const rmpResponse = await fetch(rmpEndpoint + "1");
	const rmpResponseData = await rmpResponse.json();
	
	let userReviews = [];
	let attendance = 0;
	let difficulty = 0;

	for (let reviewNum in rmpResponseData.ratings) {
		let review = rmpResponseData.ratings[reviewNum];
		userReviews.push(review.rComments);
		if (review.attendance == "Mandatory") {
			attendance++
		};
		difficulty += review.rEasy
	};

	let output = {};
	output["reviews"] = userReviews;
	output["overall"] = (parseFloat(overall));
	if (attendance/20 > .5) {
		var isMandatory = true;
	} else {
		var isMandatory = false;
	};
	output["isMandatory"] = (isMandatory);
	output["difficulty"] = (difficulty/20);
	// [All reviews, Overall Rating, is attendance mandatory, difficulty]
  //console.log(output);
	return output;
};
const list = [];

async function processRatings(object) {

  // Loop through all classes and wait for the ratings to resolve
  for (let scheduleClassInx in object.classes) {
    let ratings = await getRatings(object, scheduleClassInx); // Await the result

    if (Object.keys(ratings).length == 0) {
      console.log("IN HERE!")
      ratings = {reviews: [], overall: "N/A", isMandatory: "N/A", difficulty: "N/A"}
      object.classes[scheduleClassInx].ratings = ratings
      
    } else {
    list.push(ratings); // Push resolved ratings to list
    object.classes[scheduleClassInx].ratings = ratings; // Assign the resolved ratings
    }
    
    
    
  }

  return object; // Return the list of ratings
}



module.exports = {
  processRatings
};