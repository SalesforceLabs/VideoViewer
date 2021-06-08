/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Util methods
 */
const DOWNLOAD_PART =
  "/sfc/servlet.shepherd/document/download/";

// Returns either an empty string or the org's base video download url
export function getBaseVideoUrl(baseUrl) {
  if (baseUrl) {
    return `${baseUrl}${DOWNLOAD_PART}`;
  }
  return "";
}
