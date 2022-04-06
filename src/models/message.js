export class Message {
    id;
    channel_id;
    from;
    message;
    time;
    ownerId;
    url
    constructor(from, message, channel_id, ownerId, url) {
        this.id = 1;
        this.channel_id = channel_id;
        this.from = from;
        this.message = message;
        this.time = Date.now();
        this.ownerId = ownerId;
        this.url = url;
    }

    toJson() {
        return {
            from: this.from,
            channel_id: this.channel_id,
            message: this.message,
            time: this.time,
            ownerId: this.ownerId,
            url: this.url
        };
    }
}