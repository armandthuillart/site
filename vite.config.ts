import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    sortPackageJson: { sortScripts: true },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*": "vp check --fix",
  },
});
