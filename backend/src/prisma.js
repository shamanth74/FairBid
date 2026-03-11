import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({
    transactionOptions: {
    maxWait: 5000,   // wait 5 seconds instead of default
    timeout: 10000,  // transaction timeout 10 seconds
  }
});
export default prisma;
