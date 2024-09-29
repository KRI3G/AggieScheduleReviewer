function main(json_object){
    const thead = document.querySelector('table thead tr');
    const tbody = document.querySelector('table tbody');
    const body = document.querySelector('body');
    // [[All reviews], Overall Rating, is attendance mandatory, difficulty]
    let columns = ["classname", "professor", "data_available?", "average_gpa","a_percentage","total_students_taught","overall rating","is attendance mandatory", ];

    for(const column of columns){
        const header_div = document.createElement('th');
        header_div.innerHTML = column;
        thead.appendChild(header_div);
    }

    const classes = json_object.classes;
    for(const class_object of classes){
        const table_row = document.createElement('tr');
        const inner_class_object = class_object.class;
        const classname_div = document.createElement('td');
        classname_div.innerHTML = inner_class_object.full;
        table_row.appendChild(classname_div);

        const professor_div = document.createElement('td');
        professor_div.innerHTML = class_object.prof;
        table_row.appendChild(professor_div);

        const grades_object = class_object.grades;
        const data_available_div = document.createElement('td');
        data_available_div.innerHTML = grades_object.data_available;
        table_row.appendChild(data_available_div);

        console.log(grades_object);
        const data_object = grades_object.data;
        for(key of Object.keys(data_object)){
            const data_div = document.createElement('td');
            data_div.innerHTML = data_object[key] == null ? "N/A": data_object[key];
            table_row.append(data_div);
        }

        
        const ratings_object = class_object.ratings;
        for(key of Object.keys(ratings_object)){
            if(key == "reviews") continue;
            const ratings_div = document.createElement('td');
            ratings_object.innerHTML = ratings_object[key] == null ? "N/A": ratings_div[key];
            table_row.append(ratings_div);
        }
        

        /*
        const h1 = document.createElement('h1');
        h1.innerHTML = "What people are saying about " + class_object.prof + "!";
        for(review of ratings_object.reviews){
            const review_div = document.createElement('text');
            review_div.innerHTML = review;
            h1.appendChild(review_div);
        }
        body.appendChild(h1);
        

        */
        tbody.appendChild(table_row);
        //console.log(tbody.innerHTML);
    }
}

module.exports = {
    main
};
