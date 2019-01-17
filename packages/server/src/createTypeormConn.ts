import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConn = async () => {
  let retries = 5;
  while (retries) {
    try {
      const config = await getConnectionOptions(process.env.NODE_ENV);
      return createConnection({
        ...config,
        name: "default"
      });
    } catch (error) {
      console.log(error);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  return null;
};
