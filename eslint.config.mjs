import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='slice'][callee.object.callee.property.name='toISOString']",
          message: "Do not use .toISOString().slice(0, 10). Use toISODateString() from @/lib/dateUtils for timezone safety.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              message: "Hugeicons via @/components/ui/AppIcon is the required standard. Do not import from lucide-react.",
            },
          ],
        },
      ],
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
