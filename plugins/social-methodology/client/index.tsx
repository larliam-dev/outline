import { createLazyComponent } from "~/components/LazyLoad";
import { Hook, PluginManager } from "~/utils/PluginManager";
import config from "../plugin.json";
import Icon from "./Icon";

PluginManager.add([
  {
    ...config,
    type: Hook.Settings,
    value: {
      group: "Learning",
      icon: Icon,
      description:
        "Aprende, practica y aplica la Metodología Social: principios, proceso, quiz y simulador de proyectos.",
      component: createLazyComponent(() => import("./Settings")),
    },
  },
]);
