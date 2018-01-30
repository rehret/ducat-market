import * as Router from 'koa-router';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import * as ShortId from 'shortid';
import { injectable } from 'inversify';

@injectable()
@Middleware({ type: 'before' })
export class RequestId implements KoaMiddlewareInterface {
    public async use(ctx: Router.IRouterContext, next: (err?: any) => Promise<any>): Promise<any> {
        ctx.state.requestId = ShortId.generate();
        return await next();
    }
}
