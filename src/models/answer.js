export class Answer {
    message_id;
    from;
    message;
    time;

    constructor(from, message, message_id) {
        this.time = Date.now();
        this.from = from;
        this.message = message;
        this.message_id = message_id;
    }

    toJson() {
        return {
            time: this.time,
            from: this.from,
            message: this.message,
            message_id: this.message_id,
        };
    }
}