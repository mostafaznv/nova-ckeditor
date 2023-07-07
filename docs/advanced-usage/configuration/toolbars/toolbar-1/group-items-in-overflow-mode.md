---
description: toolbars.toolbar-1.should-not-group-when-full
---

# Group Items In Overflow Mode

<table><thead><tr><th width="404">Property Name</th><th width="149.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>toolbars.toolbar-1.should-not-group-when-full</td><td>bool</td><td>false</td></tr></tbody></table>

This option determines whether the editor's toolbar in the toolbar should display three dots (...) in overflow mode when the toolbar is full and cannot accommodate all the items within the available space.

By default, theis option is set to `false`, indicating that the editor's toolbar will display three dots (...) in overflow mode when necessary. This helps maintain a compact and visually appealing toolbar by grouping less frequently used items under the three-dot menu.

To disable the grouping of items in overflow mode within Toolbar 1, update the value of `toolbars.toolbar-1.should-not-group-when-full` in the `config/nova-ckeditor.php` file to `true`.





