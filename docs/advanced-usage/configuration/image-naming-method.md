---
description: image-naming-method
---

# Image Naming Method

| Property Name       | Type   | Default                                     |
| ------------------- | ------ | ------------------------------------------- |
| image-naming-method | string | <mark style="color:red;">`hash-file`</mark> |

The `image-naming-method` configuration option allows you to specify the naming method for uploaded images within the CKEditor field. This setting determines how the image files will be named when they are saved to the storage.

By default, the `image-naming-method` configuration option is set to `hash-file`, which generates a unique hash-based name for each uploaded image file. This helps avoid naming conflicts and ensures uniqueness of the file names.



The available naming methods for the `image-naming-method` configuration option are as follows:

* `hash-file`: This method generates a unique hash-based name for each uploaded image file.
* `real-file-name`: This method retains the original file name of the uploaded image.
* `unique-real-file-name`: This method retains the original file name but adds a unique identifier to prevent naming conflicts.

To configure the `image-naming-method` option, update the value in the configuration file `config/nova-ckeditor.php` with the desired naming method.





