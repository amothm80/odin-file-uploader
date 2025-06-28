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
  await prisma.user.deleteMany();

  const users = await Promise.all([
    await createUser("alice@example.com", hashSalt.hash, hashSalt.salt),
    await createUser("bob@example.com", hashSalt.hash, hashSalt.salt),
    await createUser("charlie@example.com", hashSalt.hash, hashSalt.salt),
    await createUser("dana@example.com", hashSalt.hash, hashSalt.salt),
  ]);
  //   console.log(users)
  let folders = [];
  for (const user of users) {
    const root = await createRootFolder(user.id, "");
    // console.log(root)
    
    folders.push(
      await Promise.all([
        await createChildFolder(user.id, "Documents", root.id),
        await createChildFolder(user.id, "Pictures",root.id),
        await createChildFolder(user.id, "Work",root.id),
      ])
    );
    folders[folders.length -1].push(root)
    // folders.push(folders)
  }
  // console.log(folders)
  // for (const folder of folders) {
  //   for (const folder2 of folder) {
  //     await createFile(
  //       `file_${Math.floor(Math.random() * 100)}`,
  //       folder2.id,
  //       folder2.userId,
  //       ""
  //     );
  //     await createFile(
  //       `file_${Math.floor(Math.random() * 100)}`,
  //       folder2.id,
  //       folder2.userId,
  //       ""
  //     );
  //   }
  // }
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
