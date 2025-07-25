<!-- <button
	aria-label="Underline"
	onclick={() => {
		editor.chain().focus().toggleUnderline().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('underline')}
>
	<Icon icon="fa6-solid:underline" />
</button>
<button
	aria-label="Highlight"
	onclick={() => {
		editor?.chain().focus().toggleHighlight().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('highlight')}
>
	<Icon icon="fa6-solid:highlighter" />
</button>
<button
	aria-label="Bold"
	onclick={() => {
		editor?.chain().focus().toggleBold().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('bold')}
>
	<Icon icon="fa6-solid:bold" />
</button>
<button
	aria-label="Italic"
	onclick={() => {
		editor?.chain().focus().toggleItalic().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('italic')}
>
	<Icon icon="fa6-solid:italic" />
</button>
<button
	aria-label="Table"
	onclick={() => {
		editor?.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('table')}
>
	<Icon icon="fa6-solid:table" />
</button>
{#if editor?.isActive('table')}
	<div class="table-controls flex gap-1">
		<button
			aria-label="Add Column Before"
			onclick={() => {
				if (editor) {
					editor.chain().focus().addColumnBefore().run();
				}
			}}
			class="tipex-edit-button"
			title="Add Column Before"
		>
			<Icon icon="fa6-solid:table-columns" />
		</button>

		<button
			aria-label="Add Column After"
			onclick={() => {
				if (editor) {
					editor.chain().focus().addColumnAfter().run();
				}
			}}
			class="tipex-edit-button"
			title="Add Column After"
		>
			<Icon icon="fa6-solid:table-columns" />
		</button>

		<button
			aria-label="Add Row Before"
			onclick={() => {
				if (editor) {
					editor.chain().focus().addRowBefore().run();
				}
			}}
			class="tipex-edit-button"
			title="Add Row Before"
		>
			<Icon icon="fa6-solid:plus" />
		</button>

		<button
			aria-label="Add Row After"
			onclick={() => {
				if (editor) {
					editor.chain().focus().addRowAfter().run();
				}
			}}
			class="tipex-edit-button"
			title="Add Row After"
		>
			<Icon icon="fa6-solid:plus" />
		</button>

		<button
			aria-label="Delete Column"
			onclick={() => {
				if (editor) {
					editor.chain().focus().deleteColumn().run();
				}
			}}
			class="tipex-edit-button"
			title="Delete Column"
		>
			<Icon icon="fa6-solid:trash" />
		</button>

		<button
			aria-label="Delete Row"
			onclick={() => {
				if (editor) {
					editor.chain().focus().deleteRow().run();
				}
			}}
			class="tipex-edit-button"
			title="Delete Row"
		>
			<Icon icon="fa6-solid:trash" />
		</button>

		<button
			aria-label="Delete Table"
			onclick={() => {
				if (editor) {
					editor.chain().focus().deleteTable().run();
				}
			}}
			class="tipex-edit-button"
			title="Delete Table"
		>
			<Icon icon="fa6-solid:trash-can" />
		</button>
	</div>
{/if}
<button
	aria-label="Subscript"
	onclick={() => {
		editor?.chain().focus().toggleSubscript().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('subscript')}
>
	<Icon icon="fa6-solid:subscript" />
</button> -->
<!-- <button
							aria-label="Center"
							onclick={() => {
								editor?.chain().focus().setTextAlign('center').run();
							}}
							class="tipex-edit-button"
							class:active={editor?.isActive({ textAlign: 'center' })}
						>
							<Icon icon="fa6-solid:align-center" />
						</button> -->
<!-- <button
	aria-label="Code"
	onclick={() => {
		editor?.chain().focus().toggleCode().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('code')}
>
	<Icon icon="fa6-solid:code" />
</button> -->
<!-- <button
							aria-label="Table"
							onclick={() => {
								editor
									?.chain()
									.focus()
									.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
									.run();
							}}
							class="tipex-edit-button"
							class:active={editor?.isActive('Table')}
						>
							<Icon icon="fa6-solid:table" />
						</button> -->
<!-- <button
	aria-label="Youtube"
	onclick={() => {
		const url = prompt('Enter Youtube URL');
		if (url) {
			editor
				?.chain()
				.focus()
				.setYoutubeVideo({
					src: url,
					width: Math.max(320, 640),
					height: Math.max(180, 480)
				})
				.run();
		}
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('Youtube')}
>
	<svg
		viewBox="0 0 256 180"
		width="32"
		height="22"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid"
	>
		<path
			d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
			fill="red"
		/>
		<path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
	</svg>
</button> -->
