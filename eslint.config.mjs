import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // New in eslint-plugin-react-hooks v7 (bundled with eslint-config-next 16).
    // Existing components hydrate from localStorage in useEffect; keep this visible
    // as a warning rather than failing lint until they are refactored.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
