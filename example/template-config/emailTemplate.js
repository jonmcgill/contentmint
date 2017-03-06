// Templates are just some html with a token that stands in place for the main staging
// area. In the place where you want to add components write in {{ stage }}. The path
// is used on page load to run an ajax request for the markup. The components array is
// just a list of components you'd like to make available for that template.
Cmint.createTemplate('email', {
    path: '/example/template-markup/email.html',
    components: ['heading', 'banner-image', 'body-copy', 'button-cta', 'course-table', 'container']
})