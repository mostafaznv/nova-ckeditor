---
description: video-model
---

# Video Model

<table><thead><tr><th>Property Name</th><th width="211.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>video-model</td><td>string</td><td><mark style="color:red;"><code>App\Models\Video</code></mark></td></tr></tbody></table>

The `video-model` configuration option allows you to specify the path of your **video** model within your Laravel application. This configuration determines which video model will be used for handling videos within the CKEditor field.

By default, the `video-model` configuration option is set to `App\Models\Video`, assuming that you have a `Video` model located in the `app/Models` directory of your application. However, you can customize this path to match the location of your own video model.

To configure the `video-model` option, update the value in the configuration file `config/nova-ckeditor.php` with the desired path to your video model.

