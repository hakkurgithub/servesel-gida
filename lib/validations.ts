import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  company: z.string().min(2, "Şirket adı en az 2 karakter olmalıdır."),
  taxNo: z.string().min(10, "Vergi numarası en az 10 karakter olmalıdır."),
  address: z.string().min(5, "Adres çok kısa."),
  phone: z.string().min(10, "Telefon numarası geçersiz."),
});