export class User {
    id;
    email;
    image;
    name;

    constructor(name: string, email: string) {
        this.id = Math.floor(Math.random() * 10000).toString();
        this.email = email;
        this.name = name;
        this.image = `https://i.pravatar.cc/24?img=${Math.floor(Math.random() * 8)}`;
    }

    toJson() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            image: this.image,
        };
    }
}