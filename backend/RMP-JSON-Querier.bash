#!/bin/bash

# Clear professors.json
echo '' > professors.json

# Campuses Ids
campusId[0]=1003
campusId[1]=1006

for campus in "${campusId[@]}"; do
# See how many pages of professors per uni
totalProffessors=`curl -s "https://www.ratemyprofessors.com/filter/professor/?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId=&sid=$campus"| jq '.searchResultsTotal'`

# Calculate number of pages
if [[ $(($totalProffessors % 20)) -eq 0 ]]; then
   pages=$(( $totalProffessors / 20))
else 
   pages=$(( $totalProffessors / 20 + 1))
fi
echo $pages

# Query for list of professors at page 'i' 
for i in $(seq 1 $pages); do
	echo "Page $i in campus $campus"
	curl -s "https://www.ratemyprofessors.com/filter/professor/?&page=$i&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId=&sid=$campus"| jq '.professors.[] |= del(.institution_name, .tMiddlename, .contentType, .categoryType, .tSid) | .professors[]' >> professors.json 
done

done

sed -i -e 's/}/},/g' professors.json
