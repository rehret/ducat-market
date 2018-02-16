import * as Router from 'koa-router';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { injectable, inject } from 'inversify';
import * as Bunyan from 'bunyan';

// prevent logging of constantly pinged endpoints
const ignoredUrls: string[] = [];

@injectable()
@Middleware({ type: 'before' })
export class RequestLogger implements KoaMiddlewareInterface {
	private log: Bunyan;

	constructor(@inject(Bunyan) log: Bunyan) {
		this.log = log;
	}

	public async use(ctx: Router.IRouterContext, next: (err?: any) => Promise<any>): Promise<any> {
		if (!ignoredUrls.includes(ctx.originalUrl)) {
			this.log.info({
				requestId: ctx.state.requestId,
				req: ctx.request
			}, 'Request received');
		}
		return await next();
	}
}
