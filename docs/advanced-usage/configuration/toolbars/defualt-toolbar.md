---
description: toolbars.default
---

# Default Toolbar

| Property Name    | Type   | Default                                     |
| ---------------- | ------ | ------------------------------------------- |
| toolbars.default | string | <mark style="color:red;">`toolbar-1`</mark> |

The `toolbars.default` configuration option allows you to specify the default toolbar for the CKEditor field. This option determines which toolbar will be used as the initial set of editing tools when the CKEditor field is loaded.

By default, the `toolbars.default` configuration option is set to `toolbar-1`, indicating that the `toolbar-1` option will be used as the default toolbar. This option assumes that you have defined a `toolbar-1` configuration in the `config/nova-ckeditor.php` file.

To configure the default toolbar, update the value of `toolbars.default` in the `config/nova-ckeditor.php` file with the desired toolbar option name.



