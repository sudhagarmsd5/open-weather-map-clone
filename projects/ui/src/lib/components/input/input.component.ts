import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';

@Component({
    selector: 'ui-input',
    template: `
    <input [class]="class()" 
           [type]="type()" 
           [value]="value()" 
           [placeholder]="placeholder()"
           [spellcheck]="false"
           (input)=" this.inputValueChange.emit($event)">
    `,
    standalone: true,
    imports: []
})
export class InputComponent {
     type = input<string>();
     class = input<string>();
     value = input<string>();
     placeholder = input<string>();    
     inputValueChange = output<any>();
}
