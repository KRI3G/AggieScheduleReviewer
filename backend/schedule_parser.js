/*
this is a dummy json objcet
can u turn pdf into this format, then I parse this and then run through the anex_data json
to find all the matches between course/instructor name - potentially also other courses taught by that same instructor

*/
const fallSchedule2024 = {
    semester: "Fall 2024",
    courses: [
      {
        course: "CHEM-107-504",
        title: "GEN CHEM FOR ENGINEERS",
        campus: "CS",
        hours: 3,
        crn: 10535,
        instructor: "Alicia Altemose",
        meetingTimes: {
          date: "2024-08-19 / 2024-12-10",
          days: "M W F",
          time: "13:50 - 14:40",
          building: "ILCB",
          room: "111 (LEC)"
        }
      },
      {
        course: "CHEM-117-550",
        title: "GEN CHEM FOR ENGR LAB",
        campus: "CS",
        hours: 1,
        crn: 26322,
        instructor: "Zachary Martinez",
        meetingTimes: {
          date: "2024-08-19 / 2024-12-10",
          days: "T",
          time: "14:20 - 17:10",
          building: "ILSQ",
          room: "E311 (LAB)"
        }
      },
      {
        course: "CLEN-181-537",
        title: "ENGR LC SUCCESS SEMINAR",
        campus: "CS",
        hours: 0,
        crn: 43280,
        instructor: "Taylor Northcut",
        meetingTimes: {
          date: "2024-08-19 / 2024-12-10",
          days: "W",
          time: "12:40 - 13:30",
          building: "ZACH",
          room: "360 (SEM)"
        }
      },
      {
        course: "ENGR-102-505",
        title: "ENGR LAB I COMPUTATION",
        campus: "CS",
        hours: 2,
        crn: 36091,
        instructor: "Craig Spears",
        meetingTimes: [
          {
            date: "2024-08-19 / 2024-12-10",
            days: "M",
            time: "17:10 - 18:00",
            building: "ZACH",
            room: "353 (LEC)"
          },
          {
            date: "2024-08-19 / 2024-12-10",
            days: "M",
            time: "18:01 - 19:00",
            building: "ZACH",
            room: "353 (LAB)"
          },
          {
            date: "2024-08-19 / 2024-12-10",
            days: "W",
            time: "17:10 - 19:00",
            building: "ZACH",
            room: "353 (LAB)"
          }
        ]
      },
      {
        course: "MATH-251-521",
        title: "ENGINEERING MATH III",
        campus: "CS",
        hours: 3,
        crn: 45423,
        instructor: "Tomasz Mandziuk",
        meetingTimes: {
          date: "2024-08-19 / 2024-12-10",
          days: "M W F",
          time: "08:00 - 08:50",
          building: "HELD",
          room: "113 (LEC)"
        }
      },
      {
        course: "POLS-207-517",
        title: "STATE & LOCAL GOVT",
        campus: "CS",
        hours: 3,
        crn: 57628,
        instructor: "Jason Smith",
        meetingTimes: {
          date: "2024-08-19 / 2024-12-10",
          days: "M W F",
          time: "15:00 - 15:50",
          building: "ILCB",
          room: "111 (LEC)"
        }
      }
    ]
  };

