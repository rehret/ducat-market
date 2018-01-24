import 'reflect-metadata';
import { createKoaServer } from 'routing-controllers';
import { DucatMarketService } from './services/ducat-market.service';

DucatMarketService.Init();

const app = createKoaServer({
    controllers: [`${__dirname}/controllers/*.[tj]s`]
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
});
