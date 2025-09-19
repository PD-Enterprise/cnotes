<!--
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
				</button> 
<button
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
						</button>
-->
