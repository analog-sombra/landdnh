import { InferInput, minLength, object, pipe, string } from "valibot";

const FeesSchema = object({
  transaction_id: pipe(
    string("Please enter your transaction ID."),
    minLength(1, "Please enter your transaction ID.")
  ),
  track_id: pipe(
    string("Please enter your track ID."),
    minLength(1, "Please enter your track ID.")
  ),
  // bank_name: pipe(
  //   string("Please enter your bank name."),
  //   minLength(1, "Please enter your bank name.")
  // ),
  // bank_ref_no: pipe(
  //   string("Please enter your bank reference number."),
  //   minLength(1, "Please enter your bank reference number.")
  // ),
  // invoice_no: pipe(
  //   string("Please enter your invoice number."),
  //   minLength(1, "Please enter your invoice number.")
  // ),
  order_id: pipe(
    string("Please enter your order ID."),
    minLength(1, "Please enter your order ID.")
  ),
});

type FeesForm = InferInput<typeof FeesSchema>;
export { FeesSchema, type FeesForm };

const RequestPaymentSchema = object({
  purpose: pipe(
    string("Please enter the purpose."),
    minLength(1, "Please enter the purpose.")
  ),
  amount: pipe(
    string("Please enter the amount."),
    minLength(1, "Please enter the amount.")
  ),
});

type RequestPaymentForm = InferInput<typeof RequestPaymentSchema>;
export { RequestPaymentSchema, type RequestPaymentForm };
