const CalendarModule = {
    calendar: null,
    init: () => {
        const el = document.getElementById("calendar");
        CalendarModule.calendar = new FullCalendar.Calendar(el, {
            initialView: "dayGridMonth",
            locale: "fr",
            selectable: true,
            headerToolbar: {
                left: "prev,next,today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,listWeek"
            },
            select: async (info) => {
                const title = prompt("Titre pour cette période ?");
                if (title) {
                    const event = {
                        title,
                        start: info.startStr,
                        end: info.endStr
                    };
                    Database.addEvent(event);
                    CalendarModule.calendar.addEvent(event);
                    Database.log(`Événement ajouté: ${title}`);
                }
            }
        });
        CalendarModule.calendar.render();

        Database.getEvents().then(events => {
            events.forEach(e => {
                CalendarModule.calendar.addEvent({
                    title: e.title,
                    start: e.start,
                    end: e.end
                });
            });
        });
    }
};