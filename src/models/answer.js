export class Answer {
    message_id;
    from;
    message;
    time;
    url;

    constructor(from, message, message_id, url) {
        this.time = Date.now();
        this.from = from;
        this.message = message;
        this.message_id = message_id;
        this.url = url;
    }

    toJson() {
        return {
            time: this.time,
            from: this.from,
            message: this.message,
            message_id: this.message_id,
            url: this.url
        };
    }
}