// Phone number format function.
export const API_KEY = "AIzaSyDPwEk4xgQiQE1TxB1wSq-bVNpbPes0dyc";

export function formatPhoneNumber(text: string) {
  var cleaned = ("" + text).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "",
      number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
        ""
      );

    return number;
  }

  return text;
}
