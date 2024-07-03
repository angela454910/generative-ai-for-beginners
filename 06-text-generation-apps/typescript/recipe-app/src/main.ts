/*
 * @Author: angela.lu “angela.lu@budweiserapac.com”
 * @Date: 2024-06-25 13:36:21
 * @LastEditors: angela.lu “angela.lu@budweiserapac.com”
 * @LastEditTime: 2024-07-03 17:45:43
 * @FilePath: /generative-ai-for-beginners/06-text-generation-apps/typescript/recipe-app/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { OpenAIClient, AzureKeyCredential, ChatRequestMessageUnion } from "@azure/openai";
import * as dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const azureApiKey = process.env.AZURE_OPENAI_API_KEY || '';

export async function main() {
    console.log("== Recipe Recommendation App ==");

    /**
     * Parameters
        endpoint
        string

        The URI for an Azure OpenAI resource, including protocol and hostname. For example: https://my-resource.openai.azure.com.

        credential
        KeyCredential
        A key credential used to authenticate to an Azure OpenAI resource.

        options
        OpenAIClientOptions
        The options for configuring the client.
     */
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || '';
    //const deploymentName = '<include-your-deployment-name-here>';

    console.log("Number of recipes: (for example: 5): ");
    const numRecipes = "2";

    console.log("List of ingredients: (for example: chicken, potatoes, and carrots): ");
    const ingredients = "chocolate";

    console.log("Filter (for example: vegetarian, vegan, or gluten-free): ");
    const filter = "peanuts";

    const promptText = `Show me ${numRecipes} recipes for a dish with the following ingredients: ${ingredients}. Per recipe, list all the ingredients used, no ${filter}: `;

    const chatMessages: ChatRequestMessageUnion[] = [
        {
            role: 'system',
            content: 'Hello, I am a recipe recommendation bot. I will recommend recipes based on the ingredients you provide me.'
        },
        {
            role: 'user',
            content: promptText
        },
    ];

    try {
        const completionResponse = await client.getChatCompletions(deploymentName, chatMessages, {
            maxTokens: 150,
            temperature: 0.1,
        });

        console.log("Recipe Recommendations: ");
        console.log(completionResponse.choices[0].message?.content);

        const oldPromptResult = completionResponse.choices[0].message?.content;
        const promptShoppingList = 'Produce a shopping list, and please do not include the following ingredients that I already have at home: ';

        const newPrompt = `Given ingredients at home: ${ingredients} and these generated recipes: ${oldPromptResult}, ${promptShoppingList}`;

        const shoppingListMessages: ChatRequestMessageUnion[] = [
            {
                role: 'system',
                content: 'Here is your shopping list:'
            },
            {
                role: 'user',
                content: newPrompt
            },
        ];

        const shoppingListResponse = await client.getChatCompletions(deploymentName, shoppingListMessages, {
            maxTokens: 150,
            temperature: 0.1,
        });

        console.log("\n ===== Shopping List ===== \n");
        console.log(shoppingListResponse.choices[0].message?.content);
    } catch (error) {
        console.log('The sample encountered an error: ', error);
    }
}

main();