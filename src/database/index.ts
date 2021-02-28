import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';

/*
export const sqllite_config: ConnectionOptions = {
    type: "sqlite",
    database: process.env.NODE_ENV === 'test' ? "./src/database/database.test.sqlite" : "./src/database/database.sqlite",
    migrations: ["./src/database/migrations/**.ts"],
    entities: ["./src/models/**.ts"],
    logging: true,
    cli: { migrationsDir: "./src/database/migrations" }
};

createConnection(sqllite_config).then(res => {
    console.log("Config created!");
});

export default async (): Promise<Connection> => {
    return createConnection(sqllite_config);
} */

//createConnection();


export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    return createConnection(

        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === 'test'
                ? "./src/database/database.test.sqlite"
                : defaultOptions.database
        })
    );
} 