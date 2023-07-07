---
description: video-model
---

# Memory

| Property Name | Type   | Default |
| ------------- | ------ | ------- |
| memory        | string | 256M    |

The `memory` configuration option allows you to specify the maximum memory for <mark style="color:red;">image resizing</mark> in the CKEditor field. This setting overrides the default PHP configuration defined in `php.ini` and determines the amount of memory allocated for image resizing operations.

By default, the `memory` configuration option is set to `256M`, indicating a maximum memory allocation of 256 megabytes. However, you can adjust this value according to the memory requirements of your application and the size of the images you expect to handle.

To configure the `memory` option, update the value in the configuration file `config/nova-ckeditor.php` with the desired memory limit.



