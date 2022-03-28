class Message {
    id;
    from;
    to;
    message;
    answers;
    time;
    constructor(from, to, message) {
        this.id = Math.floor(Math.random() * 10000).toString();
        this.from = from;
        this.to = to;
        this.message = message;
        this.time = Date.now();
        this.answers = [];
    }

    toJson() {
        return {
            id: this.id,
            from: this.from,
            to: this.to,
            message: this.message,
            answers: this.answers,
            time: this.time,
        };
    }
}