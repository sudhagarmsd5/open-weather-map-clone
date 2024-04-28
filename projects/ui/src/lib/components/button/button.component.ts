import { Component, input } from '@angular/core';

@Component({
    selector: 'ui-button',
    template: `

    @if (variant() === 'plain') {
        <button [class]="class()" [disabled]="disabled()">{{label()}}</button>
    } @else if (variant() === 'icon'){
        <button [class]="class()" [disabled]="disabled()">
        @if (label()){
            <span class="material-symbols-outlined">{{label()}}</span>
        }
        </button>
    }`,
    standalone: true,
    imports: []
})
export class ButtonComponent {
    public label = input<string | number>('');
    public variant = input<string>('text');
    class = input<string>();
    public disabled = input<boolean>(false);
}
