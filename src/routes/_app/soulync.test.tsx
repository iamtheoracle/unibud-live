import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SouLync } from "./soulync";

describe("SouLync preview route", () => {
  it("discloses that matching, verification, and booking are not connected", () => {
    const html = renderToStaticMarkup(createElement(SouLync));
    expect(html).toContain("SouLync");
    expect(html).toContain("not a live dating service");
    expect(html).toContain("No sample people or activity are shown");
    expect(html).toContain("A production release needs server-enforced adult eligibility");
    expect(html).toContain("Your discovery space is ready");
  });

  it("offers local date planning without claiming that a booking was created", () => {
    const html = renderToStaticMarkup(createElement(SouLync));
    expect(html).toContain("Plan a date or outing");
    expect(html).toContain("Prepare date idea");
    expect(html).toContain("Nothing is sent, booked, or shared");
  });
});
