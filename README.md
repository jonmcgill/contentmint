# Contentmint

A decoupled drag-and-drop content editor with a simple API built on Vue 2.0.

![editor](./editor.png)

Contentmint is helpful for teams or departments with a variety of processes or tasks that require user generated content but may not need (or may not be able to use) a comprehensive system like Wordpress or Drupal. For instance, your marketing team may use a particular email management tool that does not come with an editor but relies on hand-written HTML files. Contentmint can be tied into a simple back end to make email building simple and clean for the end user. Developers build templates, create components, and add additional hooks and processes via Contentmint's API to design a tool that uniquely fits their stakeholder's needs.

## Take a look
```
git clone https://github.com/jonmcgill/contentmint
cd contentmint
npm install
npm run dev
# The example implementation is an email builder
```


## Basics

### Setup

For a basic setup, copy `dist/basic/contentmint/` into your project. The file `editor.html` has everything you need to start an editing instance. To test the editor, spin up a live-server instance. If you don't have `live-server` run `npm install -g live-server`. Once that is complete, go to your project folder and run `live-server .`. Navigate to `contentmint/editor.html`.

Take a look at [the example editor file](./dist/basic/contentmint/editor.html) for an explanation of how the editor consumes, manipulates, and sends back your content data.

## API (docs in progress)

### Cmint.createComponent
### Cmint.createComponentHook
### Cmint.createEditorPostProcess
### Cmint.createField
### Cmint.createFieldProcess
### Cmint.createMenu
### Cmint.createOnSaveHook
### Cmint.createTemplate
### Cmint.createToolbarButton
### Cmint.getFullMarkup
### Cmint.getMarkup

### Cmint.AppFn.notify
### Cmint.AppFn.refresh

### Cmint.App.save
### Cmint.App.snapshot
### Cmint.App.undo


### Cmint.Editor.config
### Cmint.Instance.Options
### Cmint.Settings.config
