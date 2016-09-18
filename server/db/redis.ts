// Init. redis client.
import {
    createClient,
    RedisClient,
} from 'redis';
import * as config from 'config';

export {
    RedisClient,
};

let client: RedisClient | undefined = undefined;

// init new connection or return existing connection
export function getRedisClient(): RedisClient{
    if (client != null){
        return client;
    }
    const options = {
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        db: config.get<number>('redis.db'),
    };
    client = createClient(options);
    return client;
}

// end connection.
export function quit(): void{
    if (client != null){
        client.quit();
    }
}
