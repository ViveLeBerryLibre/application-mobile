import { pipeline, env } from '@huggingface/transformers';

let corrector: any = null;

env.backends.onnx.wasm!.proxy = false;
env.backends.onnx.wasm!.numThreads = 1;

export const loadGrammarModel = async () => {
    if (!corrector) {
        corrector = await pipeline(
            'text2text-generation',
            'Xenova/t5-small'
        );
    }

    return corrector;
};

export const correctText = async (
    text: string
) => {
    const model = await loadGrammarModel();

    const result = await model(text, {
        max_new_tokens: 100,
    });

    return result[0].generated_text;
};