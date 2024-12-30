import express from 'express';
import { Event, iterateDates } from './event.js';
import MOCK_EVENTS from './mockEvents.js';
import { addDays } from 'date-fns';

const app = express();
const PORT = 8080;
app.use(express.json());

const EVENTS = {};
let CURR_ID = Object.keys(EVENTS).length + 1;

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
})

app.get("/", (req, res) => {
    res.status(200).send("This is the Home page!");
});

app.post("/events/schedule", (req, res) => {
    const { employee_id, start_date, end_date } = req.body;

    if (!employee_id || !start_date) {
        return res.status(400).json({ error: 'Missing required parameters: employee_id, start_date' });
    }

    const startDate = new Date(start_date);
    if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: 'Invalid start_date. Please provide a valid date in YYYY-MM-DD format.' });
    }

    let endDate = null;
    if (end_date) {
        endDate = new Date(end_date);
        if (isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid end_date. Please provide a valid date in YYYY-MM-DD format.' });
        }
    }

    if (endDate && (startDate > endDate)) {
        return res.status(400).json({ error: "End date is before start date." });
    }

    const event = new Event(CURR_ID, employee_id, startDate, endDate);
    EVENTS[CURR_ID] = event;
    CURR_ID += 1;

    res.status(200).json(event);
});

app.patch("/events/override", (req, res) => {
    const { event_id, override_employee_id, override_start_date, override_end_date, override_type } = req.body;

    if (!override_employee_id || !override_start_date || !override_type) {
        return res.status(400).json({ error: 'Missing required parameters: override_employee_id, override_start_date, override_type' });
    }

    const startDate = new Date(override_start_date);
    if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: 'Invalid override_start_date. Please provide a valid date in YYYY-MM-DD format.' });
    }

    let endDate = null;
    if (override_end_date) {
        endDate = new Date(override_end_date);
        if (isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid override_end_date. Please provide a valid date in YYYY-MM-DD format.' });
        }
    }

    const event = EVENTS[event_id];
    if (!event) {
        return res.status(404).json({ error: 'No event found.' });
    }

    try {
        event.applyOverride(override_type, override_employee_id, startDate, endDate);
        return res.status(200).json(event);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

app.post("/events/print", (req, res) => {
    const { start_date, num_days } = req.body;
    if (!start_date || !num_days) {
        return res.status(400).json({ error: "Missing required parameters: start_date, num_days" });
    }
    const numDays = parseInt(num_days);
    if (isNaN(numDays)) {
        return res.status(400).json({ error: "Invalid num_days. Please provide an input that can be converted to an integer."})
    }
    const startDate = new Date(start_date);
    if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: 'Invalid start_date. Please provide a valid date in YYYY-MM-DD format.' });
    }
    
    const endDate = addDays(startDate, numDays);
    const days = iterateDates(startDate, endDate);
    const response = [`Printing the schedule for ${days[0]} to ${days[days.length - 1]} \n`];
    const events = Object.values(EVENTS);

    for (let day of days) {
        const dayStrings = [];
        for (let event of events) {
            const str = event.printScheduleForDay(day);
            if (str != "") {
                dayStrings.push(str);
            }
        }
        if (dayStrings.length > 0) {
            dayStrings.unshift(`==========${day}========== \n`);
            response.push(...dayStrings)
        }
    }
    if (response.length === 1) response.push("No events in schedule.");

    res.status(200).json({response: response.join("")});
});