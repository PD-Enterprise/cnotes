export type OCRStage = 'extracting' | 'processing';

export type OCRStreamChunk =
	| { type: 'stage'; stage: OCRStage }
	| { type: 'delta'; stage?: OCRStage; delta: string }
	| {
			type: 'usage';
			stage?: OCRStage;
			usage: { promptTokens: number; completionTokens: number; totalTokens: number };
	  }
	| { type: 'done' }
	| { type: 'error'; stage?: OCRStage; message: string };
