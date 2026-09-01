import handler from "vinext/server/fetch-handler";
import { mainlandChinaNotFoundResponse, shouldHideFromRequest } from "./country-block.js";

export default {
  async fetch(request, env, ctx) {
    if (shouldHideFromRequest(request)) {
      return mainlandChinaNotFoundResponse();
    }

    return handler.fetch(request, env, ctx);
  },
};
