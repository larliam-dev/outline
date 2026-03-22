import { PluginManager, Hook } from "@server/utils/PluginManager";
import config from "../plugin.json";
import router from "./api/methodology";

PluginManager.add([
  {
    ...config,
    type: Hook.API,
    value: router,
  },
]);
