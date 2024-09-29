document.getElementById('pdf-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevents the form from submitting normally

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
    } 
    else {
        console.log('No PDF file selected');
    }
});


async function retrieveData(buffer) {
    
    const response2 = await fetch(`../backend/schedule`, {
        method: 'POST',
        body: JSON.stringify({ data: buffer }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log(e));

      const data = await response2.json(response2);
      console.log(data);

}