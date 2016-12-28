import { HttpBase } from '../st-services/base/http-base';

export class GetAccountService extends HttpBase {
    constructor(servicesUrl: string, success, failure) {
        super("GET", servicesUrl, success, failure);
    }
}
