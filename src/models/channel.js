class Channel {
    id;
    is_private;
    messages;
    name;

    constructor(name, is_private) {
        this.id = Math.floor(Math.random() * 10000).toString();
        this.name = name;
        this.is_private = is_private;
        this.messages = [];
    }

    toJson() {
        return {
            id: this.id,
            is_private: this.is_private,
            messages: this.messages,
            name: this.name,
        };
    }
}