import {test, expect} from '@playwright/test';
const authVariables = require('../helpers/authVariables');
const baseUrl = authVariables.APIBaseUrl;
const emojiJsonSchema = require('../helpers/JSONs/emojiSchema');
const Ajv = require('ajv'); // AJV = 'Another JSON Validator'

test("Verificar integridad de JSONs con Emojis", async ({request}) => {
    const getEmojis = await request.get(
        `${baseUrl}/1/emoji`
    );
    const res = await getEmojis.json();
    const getEmojisResponse = res.trello;

    expect(getEmojis.ok).toBeTruthy();
    expect(getEmojis.status()).toBe(200);
    expect(getEmojisResponse).toBeDefined();

    console.log(getEmojisResponse);

    // Crear una instancia de AJV y compilar el JSON schema
    const ajv = new Ajv({ strictTypes: false }); /* el {strictTypes: false} permite que
    los atributos del JSON schema puedan tener varios tipos posibles */

    // Validar el array de JSONs comparándolo con el schema
    // el método validate es de AJV (el schema se compila una sola vez y se usa en todas las iteraciones)
    const validate = ajv.compile(emojiJsonSchema);

    try{
        for(let i = 0; i < getEmojisResponse.length; ++i) {
            if (!validate(getEmojisResponse[i]))
                console.error("Error de validación en el JSON con índice: " + i);
            expect(validate(getEmojisResponse[i])).toBeTruthy();
        }
    } catch (error) {
        console.error("Error al parsear el JSON de la respuesta: ", error);
    }

}); // fin del test