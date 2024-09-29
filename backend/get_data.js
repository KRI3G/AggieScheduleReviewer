// Aggregate all the data into one JSON

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5500
app.use(express.json({ limit: '2mb' }));  // Realistically we should be compressing the PDF but screw you!

const readSchedule = require('./read_schedule.js');
app.use(express.static(require('path').join(__dirname, "..")));

function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


app.post('/backend/schedule', async function(req, res) {
    const base64String = req.body.data; // Access the Base64 string
    const pdf = base64ToArrayBuffer(base64String)
    const data = await readSchedule.parsePDF(pdf)

    const ai_response = await require('./ai_response.js').generateReview(data)
    console.log(ai_response)
    res.send(ai_response)
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });