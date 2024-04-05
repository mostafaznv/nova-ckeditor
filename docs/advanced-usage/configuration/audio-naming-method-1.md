---
description: file-naming-method
---

# File Naming Method

| Property Name      | Type   | Default                                     |
| ------------------ | ------ | ------------------------------------------- |
| file-naming-method | string | <mark style="color:red;">`hash-file`</mark> |

The `file-naming-method` configuration option allows you to specify the naming method for uploaded files within the CKEditor field. This setting determines how the files will be named when they are saved to the storage.

By default, the `file-naming-method` configuration option is set to `hash-file`, which generates a unique hash-based name for each uploaded file. This helps avoid naming conflicts and ensures uniqueness of the file names.



The available naming methods for the `file-naming-method` configuration option are as follows:

* `hash-file`: This method generates a unique hash-based name for each uploaded file.
* `real-file-name`: This method retains the original file name of the uploaded file.
* `unique-real-file-name`: This method retains the original file name but adds a unique identifier to prevent naming conflicts.

To configure the `file-naming-method` option, update the value in the configuration file `config/nova-ckeditor.php` with the desired naming method.





