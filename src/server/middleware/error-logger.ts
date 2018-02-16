import * as Router from 'koa-router';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { injectable, inject } from 'inversify';
import * as Bunyan from 'bunyan';

@injectable()
@Middleware({ type: 'before' })
export class ErrorLogger implements KoaMiddlewareInterface {
	private log: Bunyan;

	constructor(@inject(Bunyan) log: Bunyan) {
		this.log = log;
	}

	public async use(ctx: Router.IRouterContext, next: (err?: any) => Promise<any>): Promise<any> {
		try {
			return await next();
		} catch (err) {
			this.log.error({
				requestId: ctx.state.requestId,
				err
			}, 'Server error');

			ctx.throw(err);
		}
	}
}
