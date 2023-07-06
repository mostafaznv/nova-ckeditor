# Migration

**From 5.1.0 to 5.1.1**

* `html-support` has been added to the toolbar properties in `config/nova-ckeditor.php`.

**From 4.1.2 to 5.0.0**

There were some backward incompatible changes made to the configuration file. Please review the updated config file for changes and make corresponding updates to ensure compatibility.

* `headings` removed from config file and moved to `toolbars.toolbar-1.options`.
* `headings` method removed from `CkEditor` field.
* `toolbar` property of config file moved to `toolbars.toolbar-1`.
* the arguments of `toolbar` method have changed. now you can pass toolbar name as first argument and toolbar items as second argument.

**From 3.1.1 to 3.2.0**

* Please add `removeFormat` to `toolbar.items` in config file ([config/nova-ckeditor.php](https://github.com/mostafaznv/nova-ckeditor/blob/master/config/nova-ckeditor.php)).



