/// <amd-dependency path="text!./st-image-uploader.html"/>
import * as ko from "knockout";
import { BaseComponent } from "../st-base-component/base-component";

export var template = require("text!./st-image-uploader.html");
export class viewModel extends BaseComponent {

    private form = document.getElementById('image-uploader');
    private fileSelect: any = document.getElementById('file-select');
    private uploadButton = document.getElementById('upload-button');

    constructor(params) {
        super(params);
        this.id(params.id || "st-image-uploader");

        $('input[type="file"]').bind('change', (event) => {
            event.preventDefault();
            this.uploadButton.innerHTML = 'Uploading...';

            let files = this.fileSelect.files;
            let formData = new FormData();

            // Loop through each of the selected files.
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // Check the file type.
                // if (!file.type.match('image.*')) {
                //     continue;
                // }

                // Add the file to the request.
                //console.log("File:" + file.name)
                formData.append('photos[]', file, file.name);

            }

            // Set up the request.
            var xhr = new XMLHttpRequest();

            // Open the connection.
            xhr.open('POST', '/api/uploader/files', true);


            xhr.onload = ()=> {
                if (xhr.status === 200) {
                    // File(s) uploaded.
                    this.uploadButton.innerHTML = 'Upload';
                } else {
                    alert('An error occurred!');
                }
            }

            // Send the Data.
            xhr.send(formData);
        });
    }
}
