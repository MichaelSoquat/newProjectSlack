export class Message {
    id;
    channel_id;
    from;
    message;
    time;
    constructor(from, message, channel_id) {
        this.id = 1;
        this.channel_id = channel_id;
        this.from = from;
        this.message = message;
        this.time = Date.now();
    }

    toJson() {
        return {
            from: this.from,
            channel_id: this.channel_id,
            message: this.message,
            time: this.time,
        };
    }
}