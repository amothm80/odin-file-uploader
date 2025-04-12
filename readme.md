create a .env file based on the .example_env file included

npx prisma migrate dev

npx prisma generate

Integer ID primary key fields can be changed to identity fields. sample below for a table called "Post"

ALTER TABLE "Post" ALTER "id" DROP DEFAULT;
DROP SEQUENCE "Post_id_seq"; 
ALTER TABLE "Post" ALTER "id" ADD GENERATED ALWAYS AS IDENTITY;