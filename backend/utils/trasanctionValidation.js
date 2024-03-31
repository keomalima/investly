export function validateTransactions(transaction) {
  console.log(transaction);
  const errors = {};
  const requiredFields = [
    'user_id',
    'date',
    'type',
    'ticker',
    'stock_price',
    'shares',
    'currency',
  ];

  // Loops the required fields and checks errors
  requiredFields.forEach((field) => {
    if (!transaction[field]) {
      errors[field] = `${field} is required`;
    }
  });

  if (transaction.ticker && transaction.ticker.length > 5) {
    errors.ticker = 'Stock ticker cannot exceed 5 characters';
  }

  if (transaction.type && !['buy', 'sell'].includes(transaction.type)) {
    errors.type = 'Type must be either "buy" or "sell"';
  }

  return errors;
}
