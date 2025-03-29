fetch("assets/holidays.json")
    .then((res) => res.json())
    .then((data) => {
        data.holidays.forEach(e => {
            CalendarModule.calendar?.addEvent({
                title: e.title,
                start: e.date,
                allDay: true,
                color: "#ff6961"
            });
        });
    });