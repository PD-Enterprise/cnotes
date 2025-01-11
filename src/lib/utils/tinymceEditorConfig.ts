let conf = {
	height: 700,
	menubar: false,
	shortcuts: false,
	skin: 'oxide-dark',
	content_css: 'dark',
	plugins: [
		'advlist',
		'autolink',
		'lists',
		'link',
		'image',
		'charmap',
		'anchor',
		'searchreplace',
		'visualblocks',
		'code',
		'fullscreen',
		'insertdatetime',
		'media',
		'table',
		'preview',
		'help',
		'wordcount'
	],
	toolbar:
		'undo redo | blocks | ' +
		'bold italic forecolor underline | alignleft aligncenter alignright alignjustify | bullist numlist | ' +
		'table tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
		'bullist numlist outdent indent | ' +
		' help',
	setup: (editor) => {
		editor.addShortcut('ctrl+s', 'Save', () => {
			updateNote();
		});
	},
	a11y_advanced_options: true,
	file_picker_types: 'image'
};

export default conf;
