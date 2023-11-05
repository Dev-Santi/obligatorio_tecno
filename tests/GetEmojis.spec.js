import {test, expect} from '@playwright/test';
const Ajv = require('ajv'); // AJV = 'Another JSON Validator'

const emojiJsonSchema= {
    type: 'object',
    properties: {
        name: { type: 'string' },
        unified: { type: 'string' },
        native: { type: 'string' },
        shortName: { type: 'string' },
        shortNames: {
            type: 'array',
            items: { type: 'string' },
        },
        text: { type: 'string' },
        texts: { type: ['null', 'string'] }, // Permite que sea null o string
        category: { type: 'string' },
        sheetX: { type: 'number' },
        sheetY: { type: 'number' },
        tts: { type: 'string' },
        keywords: {
            type: 'array',
            items: { type: 'string' }
        }
    },
    required: [
        'unified',
        'name',
        'native',
        'shortName',
        'shortNames',
        'text',
        'category',
        'sheetX',
        'sheetY',
        'tts',
        'keywords'
    ]
}

test('GetEmojis.spec.js',async ({request}) => {
    const getEmojis = await request.get(
        '/1/emoji'
    );
    const res = await getEmojis.json();
    const getEmojisResponse = res.trello;

    // Crear una instancia de AJV y compilar el JSON schema
    const ajv = new Ajv();
    const validate = ajv.compile(emojiJsonSchema);
    expect(getEmojis.ok).toBeTruthy();
    expect(getEmojis.status()).toBe(200);
    expect(getEmojisResponse).toBeDefined();
    console.log(getEmojisResponse[0]);

    // Validar el array de JSONs comparándolo con el schema
    // el método validate es de AJV
    for(let i = 0; i < getEmojisResponse.length; i++)
        expect(validate(getEmojisResponse[i])).toBeTruthy();

    // try{
    //     for(let i = 0; i < getEmojisResponse.length; ++i) {
    //         if (!validate(getEmojisResponse.trello[i])) {
    //             console.error('Error de validación en el JSON con índice: ' + i);
    //         }
    //         expect(validate(getEmojisResponse[i])).toBeTruthy();
    //     }
    // } catch (error) {
    //     console.error('Error al parsear el JSON de la respuesta: ', error);
    // }

}); // fin del test