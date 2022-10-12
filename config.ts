export class config {
    constructor(token:string = "", url:string = "")
    {
        this.token = token;
        this.url = url;
    }
    token: string
    url: string
}