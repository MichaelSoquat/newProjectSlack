export class Channel {
    id;
    is_private;
    messages: any[];
    name;

    constructor(name: string, is_private: string) {
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