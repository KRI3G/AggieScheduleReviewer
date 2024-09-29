const pdf_form = document.querySelector("#pdf-form");


pdf_form.addEventListener('submit', handleSubmit);

function handleSubmit(){
    pdf_form.style.display = "none";
}

