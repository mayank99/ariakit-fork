import { build } from "tsdown";

await build({
  entry: ["packages/ariakit-react/src/**/*.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: false,
  external: ["react", "react/jsx-runtime", "react-dom", "@floating-ui/dom"],
  target: "esnext",
  treeshake: false,
  clean: true,
});
