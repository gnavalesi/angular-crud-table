// Begin: ExampleService
/* global app */

function ExampleService() {
    this.getMessage = function() {
        return 'Yey!!'; 
    };

    return this;
}

app.factory('ExampleService', ExampleService);

// End: ExampleService