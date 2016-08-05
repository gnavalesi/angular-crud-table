// Begin: ExampleDirective
/* global app */

function ExampleDirective() {
    return {
        restrict: 'A',
        scope: {
            message: '@'
        },
        template: 'Message: {{message}}'
    };
}

app.directive('exampleDirective', ExampleDirective);


// End: ExampleDirective