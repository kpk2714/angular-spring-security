export class LoginRequest {
    username! : string ;
    password! : string ;
    rememberMe!: boolean;

    constructor(rememberMe : any) {
        this.rememberMe = rememberMe;
    }
}
