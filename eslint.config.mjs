// @ts-check
import eslint from '@eslint/js'
// @ts-ignore
import tseslint from 'typescript-eslint'

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommendedTypeChecked,

   {
      ignores: [  'node-modules', 'eslint.config.mjs', 'jest.config.js'],
   },
   {
      languageOptions: {
         parserOptions: {
            projectService: true,
            // @ts-ignore
            tsconfigRootDir: import.meta.dirname,
         },
      },

      rules: {
   
         "@typescript-eslint/no-base-to-string": "off",
         "@typescript-eslint/restrict-template-expressions":"off",
         "@typescript-eslint/await-thenable": "off",
         "@typescript-eslint/no-unsafe-assignment":"off",
         // 'dot-notation': 'error',
         '@typescript-eslint/no-misused-promises': 'off',
         
      },
   },
)

