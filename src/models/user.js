class User {
    id;
    email;
    first_name;
    image;
    last_name;

    constructor(first_name, last_name, email) {
        this.id = Math.floor(Math.random() * 10000).toString();
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.image = "https://i.pravatar.cc/24?img=1";
    }

    toJson() {
        return {
            id: this.id,
            email: this.email,
            frist_name: this.first_name,
            last_name: this.last_name,
            image: this.image,
        };
    }
}