database tables

retail_status = {
  retail_id,
  payment_status,
  last_payment,
  subscription_type: monthly | trimestral | semestral | perYear
  hasOne: payment_history
}

payment_history = {
  retail_id
  amount,
  payment_type,
  datePayment
}

