'''
Author: angela.lu “angela.lu@budweiserapac.com”
Date: 2024-06-25 13:36:21
LastEditors: angela.lu “angela.lu@budweiserapac.com”
LastEditTime: 2024-07-03 14:49:10
FilePath: /generative-ai-for-beginners/06-text-generation-apps/python/aoai-app-recipe.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from openai import AzureOpenAI
import os
import dotenv

# import dotenv
dotenv.load_dotenv()

# configure Azure OpenAI service client 
client = AzureOpenAI(
  azure_endpoint = os.environ["AZURE_OPENAI_ENDPOINT"], 
  api_key=os.environ['AZURE_OPENAI_API_KEY'],  
  api_version = "2023-10-01-preview"
  )

deployment=os.environ['AZURE_OPENAI_DEPLOYMENT']

no_recipes = input("No of recipes (for example, 5: ")

ingredients = input("List of ingredients (for example, chicken, potatoes, and carrots: ")

filter = input("Filter (for example, vegetarian, vegan, or gluten-free: ")

# interpolate the number of recipes into the prompt an ingredients
prompt = f"Show me {no_recipes} recipes for a dish with the following ingredients: {ingredients}. Per recipe, list all the ingredients used, no {filter}: "
messages = [{"role": "user", "content": prompt}]

completion = client.chat.completions.create(model=deployment, messages=messages, max_tokens=600, temperature = 0.1)


# print response
print("Recipes:")
print(completion.choices[0].message.content)

old_prompt_result = completion.choices[0].message.content
prompt_shopping = "Produce a shopping list, and please don't include ingredients that I already have at home: "

new_prompt = f"Given ingredients at home {ingredients} and these generated recipes: {old_prompt_result}, {prompt_shopping}"
messages = [{"role": "user", "content": new_prompt}]
completion = client.chat.completions.create(model=deployment, messages=messages, max_tokens=600, temperature=0)

# print response
print("\n=====Shopping list ======= \n")
print(completion.choices[0].message.content)

