/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { getBaseVideoUrl } from "../utils";

/**
 * Tests to cover the Utils class
 */
describe("utils", () => {
  it("calculates the org url correctly when my domain is set", () => {
    const url = "https://testing-dev-ed.cs4.my.salesforce.com";
    const baseUrl = getBaseVideoUrl(url);
    expect(baseUrl).toBe(
      "https://testing-dev-ed--c.documentforce.com/sfc/servlet.shepherd/document/download/"
    );
  });

  it("returns an empty string when the url param is falsy", () => {
    let url;
    const baseUrl = getBaseVideoUrl(url);
    expect(baseUrl).toBe("");
  });
});
