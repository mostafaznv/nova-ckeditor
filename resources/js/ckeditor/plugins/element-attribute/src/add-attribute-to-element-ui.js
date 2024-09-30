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
        return '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.88 1.982A3.752 3.752 0 0 0 1.982 4.9c-.058.288-.063 1.013-.053 7.24l.011 6.92.091.293c.404 1.304 1.312 2.212 2.616 2.616l.293.091 6.92.011c7.616.012 7.194.025 7.851-.23 1.204-.468 2.125-1.592 2.326-2.841.059-.361.059-13.639 0-14-.201-1.249-1.123-2.374-2.326-2.84-.652-.253-.234-.24-7.739-.237-5.682.003-6.876.013-7.092.059m14.019 1.479c.335.088.525.181.81.396.323.244.621.645.76 1.023l.111.3v13.64l-.111.3a2.364 2.364 0 0 1-1.349 1.349l-.3.111H5.18l-.3-.111c-.526-.194-1.068-.688-1.284-1.172-.205-.456-.196-.134-.196-7.297 0-7.163-.009-6.841.196-7.297.184-.412.696-.923 1.108-1.108.441-.198.136-.19 7.278-.192 5.885-.003 6.709.004 6.917.058M7.815 8.277a.8.8 0 0 0-.462.354l-.093.149v6.44l.093.149c.357.574 1.223.443 1.363-.207.059-.275.06-6.065.001-6.321a.747.747 0 0 0-.902-.564m3.6-.001a.806.806 0 0 0-.462.355l-.093.149V15.233l.12.17a.965.965 0 0 0 .28.253c.155.082.212.084 1.96.084 1.761 0 1.807-.002 2.12-.092a2.797 2.797 0 0 0 1.908-1.908c.088-.307.092-.376.092-1.74 0-1.364-.004-1.433-.092-1.74a2.81 2.81 0 0 0-1.888-1.904c-.287-.085-.376-.089-2.06-.1-.968-.006-1.816.003-1.885.02m3.639 1.565c.29.109.596.415.705.705.075.201.081.309.081 1.454 0 1.45-.014 1.523-.366 1.874-.351.352-.424.366-1.876.366H12.36V9.76h1.238c1.147 0 1.255.006 1.456.081" fill-rule="evenodd" /></svg>'
    }

    get _isVisible() {
        return this._balloon.visibleView === this._form;
    }

    get _isInBalloon() {
        return this._balloon.hasView(this._form);
    }
}

export default ElementAddAttributesUI;
