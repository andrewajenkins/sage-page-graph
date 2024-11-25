import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[hideOnOutsideClick]',
})
export class HideOnOutsideClickDirective implements OnDestroy {
  @Input() hideOnOutsideClick!: boolean;

  private documentListener: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.bindDocumentListener();
  }

  ngOnDestroy() {
    this.unbindDocumentListener();
  }

  bindDocumentListener() {
    if (!this.documentListener) {
      this.documentListener = (event: Event) => {
        if (
          this.hideOnOutsideClick &&
          !this.el.nativeElement.contains(event.target)
        ) {
          this.el.nativeElement.style.display = 'none';
        }
      };

      document.addEventListener('click', this.documentListener);
    }
  }

  unbindDocumentListener() {
    if (this.documentListener) {
      document.removeEventListener('click', this.documentListener);
      this.documentListener = null;
    }
  }
}
