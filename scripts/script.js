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
        const speechBubble =  document.getElementById("speech-bubble-review-text")
        document.getElementById("reveille-text-review").style.display = "flex";
        document.getElementById("loading").style.display = "none";
        const fullText = data.prompt;
        
        // Clear the text content initially
        speechBubble.textContent = "";
        let currentIndex = 0;
        async function typeLetter() {
          for (let i = 0; i < fullText.length; i++) {
            let character = fullText.charAt(i);
            speechBubble.textContent += fullText.charAt(i);
            await new Promise(resolve => setTimeout(resolve, 25));  // Adjust the speed (50ms delay per character)
           }
        }
        // Start the typing effect
        typeLetter();
      });
      

}

