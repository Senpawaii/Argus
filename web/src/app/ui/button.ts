import { Directive, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Styles a native <button>/<a> with the design-system button. */
@Directive({
  selector: 'button[uiBtn], a[uiBtn]',
  host: {
    class: 'ui-btn',
    '[class.ui-btn--primary]': "variant() === 'primary'",
    '[class.ui-btn--secondary]': "variant() === 'secondary'",
    '[class.ui-btn--ghost]': "variant() === 'ghost'",
    '[class.ui-btn--danger]': "variant() === 'danger'",
    '[class.ui-btn--sm]': "size() === 'sm'",
    '[class.ui-btn--icon]': 'icon()',
  },
})
export class UiButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<'md' | 'sm'>('md');
  readonly icon = input(false);
}
