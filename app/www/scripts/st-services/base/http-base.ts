var RSVP = require("RSVP");

export class HttpBase {
    private serviceName: string;
    private serviceType: string;
    private serviceUrl: string;
    private successCb;
    private failureCb;
    private client = new XMLHttpRequest();

    constructor() {

    }

    public init = (success, failure) => {
        this.successCb = success;
        this.failureCb = failure;
        let promise = new RSVP.Promise((resolve, reject) => {
            this.client.open(this.serviceType, this.serviceUrl);
            this.client.onreadystatechange = this.handler;
            this.client.responseType = "json";
            this.client.setRequestHeader("Accept", "application/json");
            this.client.send();
        });

        return promise;
    }

    private handler = () => {
        if (this.client.readyState === this.client.DONE) {
            if (this.client.status === 200)
            {
                this.resolve(this.client.response);
            }
            else {
                this.failure(this.client);
            }
        }
    };

    private resolve = (response) => {
        this.successCb(response);
    }

    private failure = (error) => {
        this.failureCb(error);
    }
}
