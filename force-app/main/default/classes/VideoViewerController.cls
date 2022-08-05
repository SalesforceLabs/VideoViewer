/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* Controller for the VideoViewer Component */
public with sharing class VideoViewerController {
  private static final List<String> ALLOWED_MEDIA_TYPES = new List<String>{
    'webm',
    'mp4',
    'mov',
    'm4v'
  };
  @AuraEnabled(cacheable=true)
  public static List<ContentDocumentLink> getAttachedDocuments(Id recordId) {
    List<String> allowedFileTypes = ALLOWED_MEDIA_TYPES;
    List<ContentDocumentLink> attachedDocuments = [
      SELECT
        ContentDocumentId,
        ContentDocument.Title,
        ContentDocument.Description
      FROM ContentDocumentLink
      WHERE
        LinkedEntityId = :recordId
        AND ContentDocument.FileExtension IN :allowedFileTypes
      WITH SECURITY_ENFORCED
      ORDER BY SystemModstamp
    ];
    return attachedDocuments;
  }

  @AuraEnabled(cacheable=true)
  public static String getBaseUrl() {
    return 'https://' + DomainCreator.getContentHostname();
  }
}
