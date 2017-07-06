import { Component, Output, EventEmitter, Renderer} from "@angular/core";
import { Configuration, UtilsService, InlineEditEvent } from "app/modules/common/";
import { InlineEditGenericComponent,  } from "../inline-edit-text/inline-edit-generic.component";

@Component({
    selector:    'app-inline-edit-file',
    templateUrl: 'inline-edit-file.component.html'
})
export class InlineEditFileComponent extends InlineEditGenericComponent<File> {
    // override parent properties
    @Output() protected onSave: EventEmitter<InlineEditEvent<File>> = new EventEmitter<InlineEditEvent<File>>()

    constructor(
        protected renderer: Renderer,
        protected config: Configuration,
        private utils: UtilsService)
    {
        super(renderer, config)
        this.initialValue = null;
    }

    clicked(event) {
        try {
            this.editingValue = event.target.files[0];
        }
        catch (e) {
            this.editingValue = null;
        }
        this.doneEditing()
    }
}
