import { faker } from "@faker-js/faker";
import fs from "fs";

function cretateParentDocs(schema, numOfDocument = 5) {
  if (typeof numOfDocument !== "number") {
    throw new Error("Invalid number of documents");
  }
  if (numOfDocument <= 0 || typeof schema !== "object" || Array.isArray(schema))
    return [];

  const documentList = [];

  Array.from(new Array(numOfDocument)).forEach(() => {
    const newCategory = {
      id: faker.string.uuid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...schema,
    };

    documentList.push(newCategory);
  });

  return documentList;
}

function createChildDocs(parentDocList, schema, parentKey, numOfDocument = 5) {
  if (typeof numOfDocument !== "number") {
    throw new Error("Invalid number of documents");
  }

  if (numOfDocument <= 0 || typeof schema !== "object" || Array.isArray(schema))
    return [];

  const documentList = [];

  for (const item of parentDocList) {
    Array.from(new Array(numOfDocument)).forEach(() => {
      const newProduct = {
        id: faker.string.uuid(),
        [`${parentKey}Id`]: item.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...schema,
      };

      documentList.push(newProduct);
    });
  }

  return documentList;
}

const category = {
  name: faker.commerce.department(),
};

const product = {
  name: faker.commerce.productName(),
  material: faker.commerce.productMaterial(),
  description: faker.commerce.productDescription(),
  price: Number.parseFloat(faker.commerce.price()),
  image: faker.image.url({ width: 200, height: 300 }),
};

const categoryList = cretateParentDocs(category);
const productList = createChildDocs(categoryList, product, "category");

const database = {
  categories: categoryList,
  products: productList,
};

function createDatabase(database) {
  fs.writeFile("public/db.json", JSON.stringify(database), () =>
    console.log("🚀 Generate data successfully!")
  );
}

createDatabase(database);
