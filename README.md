# Docsy Plus

Additions for the [docsy theme](https://github.com/google/docsy) for [Hugo](https://gohugo.io/), used for training content.
The docsy-plus theme inherites from the docsy theme through Hugos [Theme Components](https://gohugo.io/hugo-modules/theme-components/).

## Installation

To add the docsy and docsy-plus themes to an existing Hugo project, run the following commands from your project’s root directory:

```sh
git submodule add https://github.com/google/docsy.git themes/docsy
git submodule add https://github.com/acend/docsy-plus.git themes/docsy-plus
git submodule update --init --recursive
```

Reference both themes in your configuration, the docsy-plus needs to come first.

Example config.toml:

```toml
theme = ["docsy-plus", "docsy"]
```

## Shortcodes and Additional Features

For docsy shortcodes see here: [Docsy Shortcodes](https://www.docsy.dev/docs/adding-content/shortcodes/).

## Enhanced Cover Block

The blocks/cover shortcode from [docsy](https://www.docsy.dev/docs/adding-content/iconsimages/#add-images) has been enhanced in order to support config-dependend background an logo images.

If you add an imagePrefix setting under your site params, this prefix is used to search for background and logo images.

As example with the following setting...

```toml
[params]
imagePrefix = "fancy_"
```

... background images which contain "fancy_background" and logo images with "fancy_logo" in the filename are detected.

## Details

A shortcode to generate HTML _details_ and _summary_ tags, which is handy to make solutions-sections foldable.

Usage:

```html
{{% details title="Lab 1" %}}
Lab 1 solution
{{% /details %}}
```

## OnlyWhen and OnlyWhenNot

This shortcode is used to display or hide content based on enabled modules.

Example module configuration within your sites config.toml:

```toml
enabledModule = "base extra"
```

Use the shortcode as follows:

```html
{{% onlyWhen extra %}}
This is only displayed if extra is enabled.
{{% /onlyWhen %}}

{{% onlyWhenNot extra %}}
This only shown if extra is NOT enabled.
{{% /onlyWhenNot %}}
```

Use `{{< onlyWhen extra >}}` in plain HTML files.

It is also possible to use multiple paramaters. See the use cases below for a better understanding.


### Use cases

* `{{% onlyWhen variant1 %}}`: This is only rendered when `enabledModule` in `config.toml` contains `variant1`
* `{{% onlyWhen variant1 variant2 %}}`: This is only rendered when `enabledModule` in `config.toml` contains `variant1` **or** `variant2`
* `{{% onlyWhenNot variant1 %}}`: This is only rendered when `enabledModule` in `config.toml` **does not** contain `variant1`
* `{{% onlyWhenNot variant1 variant2 %}}`: This is only rendered when `enabledModule` in `config.toml` **does not** contain `variant1` **or** `variant2`

In order to only render text if **all** of multiple conditions do not apply simply chain several `onlyWhenNot` shortcodes:

```
{{% onlyWhenNot variant1 %}}
{{% onlyWhenNot variant2 %}}
This is only rendered when `enabledModule` in `config.toml` **does not** contain `variant1` **nor** `variant2`.
{{% /onlyWhen %}}
{{% /onlyWhen %}}
```


## Dynamically replace content

The features is used to dynamically replace content on html pages with a value taken from an URL param.
This makes it possible to adapt content with references to each users individual lab environment.

All occurences of the configured strings (see below) will be replaced with a given value.


### Enable the feature

In order to activate this feature, add the following settings in your hugo site configuration:

```toml
[params.replaceContent]
allowedHrefHosts = ['localhost', 'puzzle.ch', 'acend.ch']

[[params.replaceContent.placeholders]]
placeholder = "http://LOCALHOST"
queryParam = "h"
defaultValue = "http://localhost"
href = true

[[params.replaceContent.placeholders]]
placeholder = "<namespace>"
queryParam = "n"
defaultValue = "<namespace>"
```

It's possible to configure multiple Replacements. To replace the `href` attribute in a `a` Element you'll have to configure the allowedHrefHosts (Xss Protection) and enable the feature with `href=true` for this replacement.


### Setting a value

Set a specific value using the URL param `h`, as example: [http://localhost:1313/?h=myhost](http://localhost:1313/?h=myhost)

For the following page loads the setting will be persisted using localStorage of your browser.

### Reset

When specifying `_` as value for `h`, the localStorage setting will be removed: [http://localhost:1313/?h=_](http://localhost:1313/?h=_)

## Switch between normal and expert mode

This feature adds a switch to the navigation bar, where the users can switch between expert and normal mode. Default ist normal mode.

### Enable feature

In order to activate this feature, add the following setting in your hugo site configuration:

```toml
[params]
modeSwitcher = "true"
```

### how to use

The Mode Switcher will automatically open detail elements, with `mode-switcher="enabled"` if it's on normal mode. the elements are closed in expert mode

```markdown
{{% details title="Task 2" mode-switcher="normalexpertmode" %}}
some content
{{% /details %}}
```
