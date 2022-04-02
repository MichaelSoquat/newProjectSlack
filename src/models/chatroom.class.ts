export class Chatroom {
    id;
    from_user;
    to_user;
    messages;
    constructor(from_user, to_user) {
        this.id = Math.floor(Math.random() * 10000).toString();
        this.from_user = from_user;
        this.to_user = to_user;
        this.messages = [];
    }

    toJson() {
        return {
            id: this.id,
            from_user: this.from_user,
            to_user: this.to_user,
            messages: this.messages,
        };
    }
}