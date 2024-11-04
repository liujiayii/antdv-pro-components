import { expect, it } from "vitest";
import { isNil } from "..";

it("📅 isNil", async () => {
  expect(isNil(null)).toBe(true);
  expect(isNil(undefined)).toBe(true);
  expect(isNil(0)).toBe(false);
  expect(isNil("")).toBe(false);
  expect(isNil({})).toBe(false);
  expect(isNil(true)).toBe(false);
});
