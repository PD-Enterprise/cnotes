<!-- {#if editor?.isActive('table')}
	<div class="table-controls flex gap-1">
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
	</div>
{/if}
<button
	aria-label="Center"
	onclick={() => {
		editor.commands.setTextAlign('center').run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive({ textAlign: 'center' })}
>
	<Icon icon="fa6-solid:align-center" />
<button
	aria-label="Code"
	onclick={() => {
		editor?.chain().focus().toggleCode().run();
	}}
	class="tipex-edit-button"
	class:active={editor?.isActive('code')}
>
	<Icon icon="fa6-solid:code" />
</button> -->
