export const no = (n: number) => `094-${String(n).padStart(3, "0")}`;
export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
