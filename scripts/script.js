const {main} = require("./setup_statistics");

document.getElementById('pdf-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevents the form from submitting normally

    const table_container = document.getElementById('table-container');
    const pdf = document.getElementById('pdf-file').files[0]; 
    const pdf_form = document.querySelector("#pdf-form");
    const text_box = document.querySelector("#speech-bubble-container");
    const to_statistics_hyperlink = document.querySelector("#to_statistics_hyperlink");
        
    pdf_form.style.display = "none";
    
    if (pdf) {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const buffer = e.target.result.split(',')[1];
            console.log(buffer)
            retrieveData(buffer)
        };

        reader.readAsDataURL(pdf);
        
        text_box.style.display = "block";
        to_statistics_hyperlink.style.display = "inline";
        table_container.display = "block";
    } 
    else {
        console.log('No PDF file selected');
    }
});


async function retrieveData(buffer) {
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("loading").style.display = "block";
    const response2 = await fetch(`../backend/schedule`, {
        method: 'POST',
        body: JSON.stringify({ data: buffer }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log(e));

      response2.json(response2).then(data => {
        console.log(data);
        document.getElementById("reveille_text_review").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("speech-bubble-text_review").textContent = data.prompt
        main(data.data);
      });
    
}