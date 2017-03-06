import { Component } from "@angular/core";

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.html'
})
export class ModalComponent {

  public visible = false;
  private visibleAnimate = false;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  public bgHide(event): void {
    if (event.target.className.indexOf('modal-bg') > -1) {
      this.hide();
    }
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
}