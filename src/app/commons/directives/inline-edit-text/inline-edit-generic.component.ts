import { Input, Output, EventEmitter, Renderer } from "@angular/core";
import { Observable }                            from "rxjs";
import { Configuration }                         from "app/commons/configuration";

export const KEYCODE_ESCAPE = 27

export type InlineEditEvent<T> = {
    confirm$: EventEmitter<any>,
    value: T
}

export abstract class InlineEditGenericComponent<T> {
    @Input() protected initialValue: T
    @Output() protected onSave: EventEmitter<InlineEditEvent<T>> = new EventEmitter<InlineEditEvent<T>>()

    protected editing: boolean
    protected editingValue: T
    protected highlight: boolean
    protected confirm$: EventEmitter<any> = new EventEmitter<any>();

    constructor(protected renderer: Renderer, protected config: Configuration) {
        this.confirm$.subscribe(
            () => {
                this.editing = false
                // highlight for a few seconds
                this.highlight = true
                Observable.timer(config.HIGHLIGHT_TIME).subscribe(
                    ()=> { this.highlight = false }
                )
            }
        )
    }

    protected startEditing() {
        this.editingValue = this.initialValue
        this.editing = true
    }

    protected doneEditing() {
        if (!this.editing) {
            // editing was already cancelled (with ESC key)
            return
        }
        if (this.editingValue != this.initialValue) {
            // wait confirmation before hiding form
            let event: InlineEditEvent<T> = {
                value: this.editingValue,
                confirm$: this.confirm$
            }
            this.onSave.emit(event)
        }
        else {
            this.cancelEditing()
        }
    }

    protected cancelEditing() {
        this.editing = false
    }

    protected keypressCancelOnEscape(event) {
        if (event.keyCode == KEYCODE_ESCAPE) {
            this.cancelEditing()
        }
    }
}
