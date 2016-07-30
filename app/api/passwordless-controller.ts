/// <amd-dependency path="./api-controller"/>
var passwordless = require('passwordless');

export class PasswordlessController implements ApiController
{
    users = [
                { id: 1, email: 'marc@example.com' },
                { id: 2, email: 'alice@example.com' }
            ];
    constructor() {
        this["sendToken:path"] = "/login/sendToken";

    }

    public sendToken = (callback: any = null) => {
        passwordless.requestToken(
        (user, delivery, callback) => {
            for (var i = this.users.length - 1; i >= 0; i--) {
                if(this.users[i].email === user.toLowerCase()) {
                    return callback(null, this.users[i].id);
                }
            }
            callback(null, null);
        });
        console.log("inside PasswordlessController.sendToken");
    }


}
