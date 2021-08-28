

```js
/**
 * Focus Tracking
 * @source https://stackoverflow.com/questions/49663625/how-to-listen-to-focus-event-in-ckeditor-5
 */
editor.ui.focusTracker.on( 'change:isFocused', ( evt, name, value ) => {
    console.log( 'isFocused = ', value );
});
editor.editing.view.document.on( 'change:isFocused', ( evt, name, value ) => {
    console.log( 'editable isFocused =', value );
});
```
