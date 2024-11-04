import { expect, it } from "vitest";
import { isUrl } from "..";

it("🪓 isUrl", async () => {
  expect(isUrl("https://procomponents.ant.design/components/layout")).toBe(
    true,
  );
  expect(
    isUrl(
      "https://procomponents.ant.design/en-US/components/layout#basic-usage",
    ),
  ).toBe(true);
  expect(isUrl("procomponents.ant.design/en-US/components/layout")).toBe(
    false,
  );
  expect(
    isUrl("https:://procomponents.ant.design/en-US/components/layout"),
  ).toBe(false);
});
