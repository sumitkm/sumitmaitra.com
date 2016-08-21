
export class HttpBase {
    // private serviceName: string;
    private serviceType: string;
    private serviceUrl: string;
    private successCb;
    private failureCb;
    private client = new XMLHttpRequest();
    private promise;

    constructor(servicesUrl: string, serviceType: string, success, failure) {
        // this.serviceUrl = serviceName;
        this.serviceType = serviceType;
        this.serviceUrl = servicesUrl;
        this.successCb = success;
        this.failureCb = failure;
    }

    public getPromise = (data: any) => {
        let RSVP = require("RSVP");
        let promise = new RSVP.Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            client.open(this.serviceType, this.serviceUrl);
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();

            function handler() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        resolve(this.response);
                    }
                    else {
                        reject(this);
                    }
                }
            };
        });
        return promise;
    }

    public execute = (data: any) => {
        let RSVP = require("RSVP");
        let promise = new RSVP.Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            client.open(this.serviceType, this.serviceUrl);
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();

            function handler() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        resolve(this.response);
                    }
                    else {
                        reject(this);
                    }
                }
            };
        });

        promise.then((json) => {
            // continue
            this.successCb(json);
        }, (error) => {
            // handle errors
            this.failureCb(error);
        });
    }
}
