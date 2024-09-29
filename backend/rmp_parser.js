// Import node fetch
const fetch = require('node-fetch');
const fs = require("fs").promises;

// Test object
const object = {
  "data": [
    {
      "class": {
        "dept": "CHEM",
        "num": "107",
        "section": "504",
        "full": "CHEM-107-504"
      },
      "name": "GEN CHEM FOR ENGINEERS",
      "campus": "CS",
      "hours": "3",
      "id": "10535",
      "prof": "Alicia Altemose",
      "dates": [
        {
          "date": "2024-08-19 / 2024-12-10",
          "days": [
            "M",
            "W",
            "F"
          ],
          "timeStart": "13:50",
          "timeEnd": "14:40",
          "building": {
            "name": "ILCB",
            "room": "111",
            "type": "LEC"
          }
        }
      ]
    },
    {
      "class": {
        "dept": "CHEM",
        "num": "117",
        "section": "550",
        "full": "CHEM-117-550"
      },
      "name": "GEN CHEM FOR ENGR LAB",
      "campus": "CS",
      "hours": "1",
      "id": "26322",
      "prof": "Zachary Martinez",
      "dates": [
        {
          "date": "2024-08-19 / 2024-12-10",
          "building": {
            "name": "ILSQ",
            "room": "E311",
            "type": "LAB"
          },
          "days": [
            "T"
          ],
          "timeStart": "14:20",
          "timeEnd": "17:10"
        }
      ]
    },
    {
      "class": {
        "dept": "CLEN",
        "num": "181",
        "section": "537",
        "full": "CLEN-181-537"
      },
      "name": "ENGR LC SUCCESS SEMINAR",
      "campus": "CS",
      "hours": "0",
      "id": "43280",
      "prof": "Taylor Northcut",
      "dates": [
        {
          "date": "2024-08-19 / 2024-12-10",
          "building": {
            "name": "ZACH",
            "room": "360",
            "type": "SEM"
          },
          "days": [
            "W"
          ],
          "timeStart": "12:40",
          "timeEnd": "13:30"
        }
      ]
    },
    {
      "class": {
        "dept": "ENGR",
        "num": "102",
        "section": "505",
        "full": "ENGR-102-505"
      },
      "name": "ENGR LAB I COMPUTATION",
      "campus": "CS",
      "hours": "2",
      "id": "36091",
      "prof": "Craig Spears",
      "dates": [
        {
          "date": "2024-08-19 / 2024-12-10",
          "days": [
            "W"
          ],
          "timeStart": "17:10",
          "timeEnd": "19:00",
          "building": {
            "name": "ZACH",
            "room": "353",
            "type": "LAB"
          }
        },
        {
          "date": "2024-08-19 / 2024-12-10",
          "days": [
            "M"
          ],
          "timeStart": "18:01",
          "timeEnd": "19:00",
          "building": {
            "name": "ZACH",
            "room": "353",
            "type": "LAB"
          }
        },
        {
          "date": "2024-08-19 / 2024-12-10",
          "building": {
            "name": "ZACH",
            "room": "353",
            "type": "LEC"
          },
          "days": [
            "M"
          ],
          "timeStart": "17:10",
          "timeEnd": "18:00"
        }
      ]
    },
    {
      "class": {
        "dept": "MATH",
        "num": "251",
        "section": "521",
        "full": "MATH-251-521"
      },
      "name": "ENGINEERING MATH III",
      "campus": "CS",
      "hours": "3",
      "id": "45423",
      "prof": "Tomasz Mandziuk",
      "dates": [
        {
          "date": "2024-08-19 / 2024-12-10",
          "building": {
            "name": "HELD",
            "room": "113",
            "type": "LEC"
          },
          "days": [
            "M",
            "W",
            "F"
          ],
          "timeStart": "08:00",
          "timeEnd": "08:50"
        }
      ]
    },
    {
      "class": {
        "dept": "POLS",
        "num": "207",
        "section": "517",
        "full": "POLS-207-517"
      },
      "name": "STATE & LOCAL GOVT",
      "campus": "CS",
      "hours": "3",
      "id": "57628",
      "prof": "Jason Smith",
      "dates": [
        {
          "date": "2024-08-19 / 2024-12-10",
          "building": {
            "name": "ILCB",
            "room": "111",
            "type": "LEC"
          },
          "days": [
            "M",
            "W",
            "F"
          ],
          "timeStart": "15:00",
          "timeEnd": "15:50"
        }
      ]
    }
  ]
};


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
	const profName = ultimateObj.data[classIndex].prof;

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
	const profName = ultimateObj.data[classIndex].prof;
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

async function processRatings() {

  // Loop through all classes and wait for the ratings to resolve
  for (let scheduleClassInx in object.data) {
    const ratings = await getRatings(object, scheduleClassInx); // Await the result
    object.data[scheduleClassInx].ratings = ratings; // Assign the resolved ratings
    list.push(ratings); // Push resolved ratings to list
  }
  //console.log(list);
  return list; // Return the list of ratings
}


processRatings()
  .then((list) => {
    console.log(list);
  })
  .catch((error) => {
    console.error("error! ", error);
  });
  


module.exports = {
  processRatings
};