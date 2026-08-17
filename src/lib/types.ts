export type OCRStreamChunk =
	| { type: 'delta'; delta: string }
	| {
			type: 'usage';
			usage: { promptTokens: number; completionTokens: number; totalTokens: number };
	  }
	| { type: 'done' }
	| { type: 'error'; message: string };
