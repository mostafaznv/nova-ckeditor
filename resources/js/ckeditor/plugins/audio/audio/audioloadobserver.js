import {Observer} from 'ckeditor5/src/engine'

export default class AudioLoadObserver extends Observer {
    observe(domRoot) {
        this.listenTo(domRoot, 'load', (event, domEvent) => {
            const domElement = domEvent.target;

            if (this.checkShouldIgnoreEventFromTarget(domElement)) {
                return;
            }

            if (domElement.tagName === 'AUDIO') {
                this._fireEvents(domEvent);
            }
            // Use capture phase for better performance (#4504).
        }, {useCapture: true});
    }

    _fireEvents(domEvent) {
        if (this.isEnabled) {
            this.document.fire('layoutChanged');
            this.document.fire('audioLoaded', domEvent);
        }
    }

    stopObserving(domRoot) {
        this.stopListening(domRoot);
    }
}
