export default {
  'pre-commit': 'npx lint-staged',
  'pre-push': 'npm run typecheck',
};
