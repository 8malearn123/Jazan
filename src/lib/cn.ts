/** يدمج أسماء الفئات (classNames) ويتجاهل القيم الفارغة */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
