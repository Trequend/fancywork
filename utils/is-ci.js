if (process.env.CI) {
  console.log('CI detected');
  process.exit(0);
} else {
  process.exit(1);
}
