import { format, addDays, subDays, isBefore } from 'date-fns';

const OVERRIDE_TYPE = {
    today_only: "TODAY_ONLY",
    today_forward: "TODAY_FORWARD"
}
export class Event {
    constructor(id, employee_id, start_date, end_date=null) {
        this.id = id;
        this.employee_id = employee_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.schedule = {};
    }

    applyOverride = (override_type, employee_id, start_date, end_date) => {
        switch (override_type) {
            case OVERRIDE_TYPE.today_only:
                const date = format(addDays(start_date, 1), 'yyyy-MM-dd'); // Need to offset date
                this.schedule[date] = employee_id;
                break;
            case OVERRIDE_TYPE.today_forward:
                if (end_date === null) {
                    const oldEmpDates = iterateDates(this.start_date, start_date);
                    
                    for (let day of oldEmpDates) {
                        this.schedule[day] = this.employee_id;
                    }

                    this.employee_id = employee_id;
                    break;
                } else {
                    const override = iterateDates(start_date, end_date);
                    for (let day of override) {
                        this.schedule[day] = employee_id;
                    }
                }
                break;
            default:
                throw new Error("override_type not supported.")
        }
    }

    printScheduleForDay = (date) => {
        if (this.schedule[date]) {
            return `Event ${this.id} | ${date} | Employee ${this.schedule[date]} \n`;
        }

        const currDate = new Date(date);
        if (this.end_date === null || isBefore(currDate, this.end_date) || currDate.toISOString() === this.end_date.toISOString()) {
            if (isBefore(this.start_date, currDate) || this.start_date.toISOString() === currDate.toISOString()) {
                return `Event ${this.id} | ${date} | Employee ${this.employee_id} \n`;
            }
        } 

        return "";
    }
}

export function iterateDates(start_date, end_date) {
    let currentDate = addDays(start_date, 1); // This is to offset an issue the library had when iterating through dates where it always included the day before you actually submitted as a start date 
    const dates = [];

    while (isBefore(currentDate, end_date) || currentDate.toISOString() === end_date.toISOString()) {
        const date = format(currentDate, 'yyyy-MM-dd');
        dates.push(date);
        currentDate = addDays(currentDate, 1);
    }

    return dates;
}

