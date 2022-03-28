class Answer {
    id;
    from_user;
    message;
    answers;

    constructor(from_user, message) {
        this.id = Math.floor(Math.random() * 10000).toString();
        this.from_user = from_user;
        this.message = message;
        this.answers = [];
    }

    toJson() {
        return {
            id: this.id,
            from_user: this.from_user,
            message: this.message,
            answers: this.answers,
        };
    }
}