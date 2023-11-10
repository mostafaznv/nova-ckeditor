---
description: image-model
---

# Image Model

<table><thead><tr><th>Property Name</th><th width="211.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>image-model</td><td>string</td><td><mark style="color:red;"><code>App\Models\Image</code></mark></td></tr></tbody></table>

The `image-model` configuration option allows you to specify the path of your **image** model within your Laravel application. This configuration determines which image model will be used for handling images within the CKEditor field.

By default, the `image-model` configuration option is set to `App\Models\Image`, assuming that you have a `Image` model located in the `app/Models` directory of your application. However, you can customize this path to match the location of your own image model.

To configure the `image-model` option, update the value in the configuration file `config/nova-ckeditor.php` with the desired path to your image model.

