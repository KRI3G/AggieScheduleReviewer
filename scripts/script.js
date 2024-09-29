const to_statistics = document.querySelector("#to-statistics");

to_statistics.addEventListener('click', function(){
    window.location.href = "https://example.com"; //move to statistics webpage
});


document.getElementById('pdf-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting normally

    const pdf = document.getElementById('pdf-file').files[0]; 
    const pdf_form = document.querySelector("#pdf-form");
    const text_box = document.querySelector("#speech-bubble-container");
        
    pdf_form.style.display = "none";
    
    if (pdf) {
        //console.log('PDF file selected:', pdf); 
        const reader = new FileReader();

        reader.onload = async (e) => {
            const buffer = e.target.result;
            console.log(buffer)
            retrieveData(buffer)
        };

        reader.readAsArrayBuffer(pdf);

        text_box.style.display = "block";
    } 
    else {
        console.log('No PDF file selected');
    }
});

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

async function retrieveData(buffer) {
    const bufferBase64 =  btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    console.log(bufferBase64)
    const response2 = await fetch(`../backend/schedule`, {
        method: 'POST',
        body: JSON.stringify({ data: bufferBase64 }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log(e));

      const data = await response2.json(response2)
      console.log(data)

}