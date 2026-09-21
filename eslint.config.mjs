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
        "warn",
        {
          paths: [
            {
              name: "lucide-react",
              message: "Hugeicons via @/components/ui/AppIcon is the active standard. Avoid importing from lucide-react in new or updated code.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
