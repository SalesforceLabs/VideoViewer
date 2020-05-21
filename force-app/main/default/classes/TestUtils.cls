/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

 /* Common Test Utilities */
@isTest
public class TestUtils {
  public static Case createTestCase(String caseSubject) {
    Case c = new Case(Subject = caseSubject, Status = 'New', Origin = 'Web');
    insert c;
    return c;
  }

  public static Case getCaseBySubject(String subject) {
    return [
      SELECT Id
      FROM Case
      WHERE Subject = :subject
      WITH SECURITY_ENFORCED
    ][0];
  }

  public static ContentVersion createContentVersion(
    String title,
    String pathOnClient
  ) {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = Blob.valueOf('test');
    cv.Title = title;
    cv.ContentLocation = 's';
    cv.PathOnClient = pathOnClient;
    insert cv;
    return cv;
  }

  private static ContentVersion getContentVersionByTitle(String title) {
    return [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Title = :title
      WITH SECURITY_ENFORCED
    ];
  }

  public static void attachDocumentToCase(
    String caseSubject,
    String documentTitle
  ) {
    ContentDocumentLink cdl = new ContentDocumentLink();
    Case c = getCaseBySubject(caseSubject);
    ContentVersion cv = getContentVersionByTitle(documentTitle);
    cdl.LinkedEntityId = c.Id;
    cdl.ContentDocumentId = cv.ContentDocumentId;
    cdl.shareType = 'V';
    insert cdl;
  }
}
