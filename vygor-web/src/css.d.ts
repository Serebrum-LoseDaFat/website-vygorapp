// TypeScript 6 raises TS2882 for side-effect imports of non-code files unless
// they are declared. Next handles the bundling; this just satisfies the checker.
declare module "*.css";
