import { Event } from "./event.js"
const event1 = new Event(1, 1, new Date("2024-12-28"), new Date("2024-12-30"));
const event2 = new Event(2, 2, new Date("2025-01-01"), null);
const event3 = new Event(3, 2, new Date("2025-01-04"), new Date("2025-02-20"));
const event4 = new Event(4, 3, new Date("2025-01-02"), new Date("2025-02-20"));

const MOCK_EVENTS = {
    "1": event1,
    "2": event2,
    "3": event3,
    "4": event4
}

export default MOCK_EVENTS;
