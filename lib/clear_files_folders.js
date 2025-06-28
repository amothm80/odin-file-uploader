import { prisma } from "../config/database.js";
import { createUser } from "../model/user.js";
import { createRootFolder , createChildFolder} from "../model/folder.js";
import { createFile } from "../model/file.js";
/**

{
  salt: '8bd1634b4cfdb7cc4b9ff0a779f821f11bced2f0030bd5b63c6ccb66562c267b',
  hash: '0f3748dc6c090165eb72d4ef0b06076c9d72c904cbbe56275735855c154286c0d8b71f451958952c24612be1a165eb64f41e4d31fdd9e3e3213c63ea1c3fc839'
}

 */

const hashSalt = {
  salt: "8bd1634b4cfdb7cc4b9ff0a779f821f11bced2f0030bd5b63c6ccb66562c267b",
  hash: "0f3748dc6c090165eb72d4ef0b06076c9d72c904cbbe56275735855c154286c0d8b71f451958952c24612be1a165eb64f41e4d31fdd9e3e3213c63ea1c3fc839",
};

async function main() {
  await prisma.file.deleteMany();
  await prisma.folder.deleteMany();
 
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// console.log (alice,bob, charlie,dana)
