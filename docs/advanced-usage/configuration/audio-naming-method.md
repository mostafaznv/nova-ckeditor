---
description: audio-naming-method
---

# Audio Naming Method

| Property Name       | Type   | Default                                     |
| ------------------- | ------ | ------------------------------------------- |
| audio-naming-method | string | <mark style="color:red;">`hash-file`</mark> |

The `audio-naming-method` configuration option allows you to specify the naming method for uploaded audio files within the CKEditor field. This setting determines how the audio files will be named when they are saved to the storage.

By default, the `audio-naming-method` configuration option is set to `hash-file`, which generates a unique hash-based name for each uploaded audio file. This helps avoid naming conflicts and ensures uniqueness of the file names.



The available naming methods for the `audio-naming-method` configuration option are as follows:

* `hash-file`: This method generates a unique hash-based name for each uploaded audio file.
* `real-file-name`: This method retains the original file name of the uploaded audio.
* `unique-real-file-name`: This method retains the original file name but adds a unique identifier to prevent naming conflicts.

To configure the `audio-naming-method` option, update the value in the configuration file `config/nova-ckeditor.php` with the desired naming method.





