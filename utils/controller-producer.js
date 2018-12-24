
const buildJsonController = (success, errhandle) => {
  return async (ctx, next) => {
    try {
      const response = await success(ctx, next)
      ctx.response.type = "application/json";
      ctx.response.status = 200;
      ctx.response.body = response;
    } catch (err) {
      errhandle(err)
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed', error: err.message};
    }
  }
}

module.exports = buildJsonController
