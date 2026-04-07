import chalk from 'chalk';

const BRAND = chalk.hex('#4f7cff').bold('⬡ DiviDen');
const DIVIDER = chalk.gray('─'.repeat(50));

export const logger = {
  brand(): void {
    console.log('');
    console.log(DIVIDER);
    console.log(`  ${BRAND} ${chalk.gray('Command Center')}`);
    console.log(DIVIDER);
    console.log('');
  },

  info(message: string): void {
    console.log(`  ${chalk.blue('ℹ')} ${message}`);
  },

  success(message: string): void {
    console.log(`  ${chalk.green('✔')} ${message}`);
  },

  warn(message: string): void {
    console.log(`  ${chalk.yellow('⚠')} ${message}`);
  },

  error(message: string): void {
    console.log(`  ${chalk.red('✖')} ${message}`);
  },

  step(step: number, total: number, message: string): void {
    console.log(`  ${chalk.hex('#4f7cff')(`[${step}/${total}]`)} ${message}`);
  },

  blank(): void {
    console.log('');
  },

  divider(): void {
    console.log(DIVIDER);
  },

  list(items: string[]): void {
    items.forEach((item) => {
      console.log(`    ${chalk.gray('•')} ${item}`);
    });
  },

  table(rows: Record<string, string>): void {
    const maxKey = Math.max(...Object.keys(rows).map((k) => k.length));
    Object.entries(rows).forEach(([key, value]) => {
      console.log(`    ${chalk.gray(key.padEnd(maxKey + 2))}${value}`);
    });
  },
};
