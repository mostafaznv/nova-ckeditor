/* eslint-disable no-undef */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ElementAddAttributesFormView from './ui/add-attribute-to-element-view';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';

class ElementAddAttributesUI extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    static get pluginName() {
        return 'ElementAddAttributesUI';
    }

    init() {
        this._createButton();
        this._createForm();
    }

    destroy() {
        super.destroy();
        this._form.destroy();
    }

    _createButton() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('elementIdAttributes', locale => {
            const command = editor.commands.get('elementIdAttributes');
            const view = new ButtonView(locale);

            view.set({
                label: t('Set element id attribute'),
                icon: this._pluginIcon(),
                tooltip: true,
                class: 'element-add-attributes-btn'
            });

            view.bind('isEnabled').to(command, 'isEnabled');

            view.on('execute', () => {
                this._showForm()
            });

            return view;
        });
    }

    _createForm() {
        const editor = this.editor;
        const view = editor.editing.view;
        const viewDocument = view.document;

        this._balloon = this.editor.plugins.get('ContextualBalloon');

        this._form = new ElementAddAttributesFormView(editor.locale);
        // Render the form so its #element is available for clickOutsideHandler.
        this._form.render();

        this.listenTo(this._form, 'submit', () => {
            editor.execute('elementIdAttributes', {
                newValue: this._form.labeledInput.inputView.element.value
            });

            this._hideForm(true);
        });

        this.listenTo(this._form, 'cancel', () => {
            this._hideForm(true);
        });

        // Close the form on Esc key press.
        this._form.keystrokes.set('Esc', (data, cancel) => {
            this._hideForm(true);
            cancel();
        });

        // Reposition the balloon or hide the form if an image widget is no longer selected.
        this.listenTo(editor.ui, 'update', () => {
            if (!viewDocument.selection) {
                this._hideForm(true);
            }
        });

        // Close on click outside of balloon panel element.
        clickOutsideHandler({
            emitter: this._form,
            activator: () => this._isVisible,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideForm()
        });
    }

    _showForm() {
        if (this._isVisible) {
            return;
        }

        const editor = this.editor;
        const command = editor.commands.get('elementIdAttributes');
        const labeledInput = this._form.labeledInput;

        if (!this._isInBalloon) {
            const defaultPositions = BalloonPanelView.defaultPositions;
            const target = editor.ui.view.element.querySelector('.element-add-attributes-btn');

            this._balloon.add({
                view: this._form,
                position: {
                    target,
                    positions: [
                        defaultPositions.northArrowSouth,
                        defaultPositions.northArrowSouthWest,
                        defaultPositions.northArrowSouthEast,
                        defaultPositions.southArrowNorth,
                        defaultPositions.southArrowNorthWest,
                        defaultPositions.southArrowNorthEast
                    ]
                }
            });
        }

        // Make sure that each time the panel shows up, the field remains in sync with the value of
        // the command. If the user typed in the input, then canceled the balloon (`labeledInput#value`
        // stays unaltered) and re-opened it without changing the value of the command, they would see the
        // old value instead of the actual value of the command.
        // https://github.com/ckeditor/ckeditor5-image/issues/114
        labeledInput.inputView.value = labeledInput.inputView.element.value = command.value || '';

        this._form.labeledInput.inputView.select();
    }

    _hideForm(focusEditable) {
        if (!this._isInBalloon) {
            return;
        }

        // Blur the input element before removing it from DOM to prevent issues in some browsers.
        // See https://github.com/ckeditor/ckeditor5/issues/1501.
        if (this._form.focusTracker.isFocused) {
            this._form.saveButtonView.focus();
        }

        this._balloon.remove(this._form);

        if (focusEditable) {
            this.editor.editing.view.focus();
        }
    }

    _pluginIcon() {
        return '<svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g fill="none" style="color: transparent"><path d="M0 0h24v24h-24v-24Z"></path><path stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 15v-6"></path><path stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.6 15h-3v-6h3c1.105 0 2 .895 2 2v2c0 1.105-.895 2-2 2Z"></path><path stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.353 21.353h-12.706c-1.657 0-3-1.343-3-3v-12.706c0-1.657 1.343-3 3-3h12.705c1.657 0 3 1.343 3 3v12.705c.001 1.658-1.342 3.001-2.999 3.001Z"></path></g></svg>'
    }

    get _isVisible() {
        return this._balloon.visibleView === this._form;
    }

    get _isInBalloon() {
        return this._balloon.hasView(this._form);
    }
}

export default ElementAddAttributesUI;
