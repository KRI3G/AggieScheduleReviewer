// Aggregate all the data into one JSON

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5500
app.use(express.json({ limit: '2mb' }));  // Realistically we should be compressing the PDF but screw you!

const readSchedule = require('./backend/read_schedule.js');
app.use(express.static(__dirname));

function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


app.post('/backend/schedule', async function(req, res) {
    console.log("Request of Schedule")
    const base64String = req.body.data; // Access the Base64 string
    const pdf = new Buffer.from(base64String, 'base64');
    const data = await readSchedule.parsePDF(pdf)
    const json_object = JSON.stringify(data, null, 2);

                require('fs').writeFileSync('./data/schedule.json', json_object, (err) => {
                    if(err) { 
                        console.error("Error writing JSON object to file", err);
                    }else{
                        console.log("JSON data successfully written to file!");
                    }
            });
    const ai_response = await require('./backend/ai_response.js').generateReview(data)
    console.log(ai_response)
    res.send(ai_response)
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });