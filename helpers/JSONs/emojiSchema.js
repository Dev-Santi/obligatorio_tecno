const emojiJsonSchema = {
    type: 'object',
    properties: {
        unified: { type: 'string' },
        name: { type: ['null', 'string'] }, // Permite que sea null o string
        native: { type: 'string' },
        shortName: { type: 'string' },
        shortNames: {
            type: 'array',
            items: { type: 'string' }
        },
        text: { type: ['null', 'string'] },
        texts: {
            'type': ['null', 'string', 'array'], // Permite que sea null, string o un array de strings
            'items': {
                'type': 'string'
            }
        },
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
        'texts',
        'category',
        'sheetX',
        'sheetY'
    ]
}

module.exports = emojiJsonSchema;