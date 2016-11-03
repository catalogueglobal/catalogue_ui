import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer} from "@angular/core";
import {Observable} from "rxjs";
import {Configuration} from "../../configuration";
import {InlineEditGenericComponent, InlineEditEvent} from "./inline-edit-generic.component";

@Component({
  selector: 'app-inline-edit-text',
  templateUrl: 'inline-edit-text.component.html'
})

export class InlineEditTextComponent extends InlineEditGenericComponent<string> {

  // override parent properties
  @Input() protected initialValue: string
  @Output() protected onSave: EventEmitter<InlineEditEvent<string>> = new EventEmitter<InlineEditEvent<string>>()
  @ViewChild('inlineInput') protected inlineInput: ElementRef;

  constructor(protected renderer: Renderer, protected config: Configuration) {
    super(renderer, config)
  }

  // override parent
  startEditing() {
    super.startEditing()

    // timer mandatory for select()
    this.editingValue = "" // mandatory for cursor at end of input
    Observable.timer(50).subscribe(()=> {
      this.renderer.invokeElementMethod(this.inlineInput.nativeElement, 'focus')
      this.editingValue = this.initialValue
    })
  }
}
