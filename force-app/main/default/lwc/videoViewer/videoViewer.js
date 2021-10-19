/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, wire, track } from "lwc";
import getAttachedDocuments from "@salesforce/apex/VideoViewerController.getAttachedDocuments";
import getBaseUrl from "@salesforce/apex/VideoViewerController.getBaseUrl";
import CONTENTDOCUMENT_OBJECT from "@salesforce/schema/ContentDocument";
import FORM_FACTOR from "@salesforce/client/formFactor";
import { getBaseVideoUrl } from "./utils";

/**
 * An LWC to play videos inline in an Org.
 * It can be used either:
 *  - Any record page where a video can be attached (eg. Account, Contact)
 *  - Any ContentDocument record detail page
 */
export default class VideoViewer extends LightningElement {
  // Title for the component
  @api
  title;

  // Should the video start muted ?
  @api
  muted;

  // Should the video name be shown ?
  @api
  showVideoName;

  // Width for large devices
  @api
  desktopWidth;

  // Height for large devices
  @api
  desktopHeight;

  // Width for medium devices
  @api
  tabletWidth;

  // Height for medium devices
  @api
  tabletHeight;

  // Width for small devices
  @api
  mobileWidth;

  // Height for small devices
  @api
  mobileHeight;

  // Should we show the number of supported videos ?
  @api
  showVideoCountInTitle;

  // Should we show the video description ?
  @api
  showVideoDescription;

  // Hide if no video is available ?
  @api
  hideIfNoVideoAvailable;

  // Message when there is no supported video attached to the record
  @api
  noVideoMessage;

  // Error message when something wrong happens
  @api
  errorMessage;

  // Id for the currnet record
  @api
  recordId;

  // Api name for the record's object. Eg. ContentDocument, Account etc.
  @api
  objectApiName;

  // A map to store document title, description, and URLs
  videoMap = {};

  // private variable to keep count of the video the user is on
  @track
  _currentVideoCount = 0;

  // Title for the current video
  currentVideoTitle;

  // Description for the current video
  currentVideoDescription;

  // Total number of videos
  @track
  totalVideos = 0;

  // Flag to enable/disable navigation's forward button
  forwardButtonDisabled = false;

  // Flag to enable/disable navigation's previous button
  previousButtonDisabled = true;

  // Flag to show/hide video element
  hasNoVideos = true;

  // Flag to show/hide navigation
  showNavigation = true;

  // Flag to show hide loading spinner
  hasLoadingCompleted = false;

  // Keeping track of the video url
  currentVideoUrl = "";

  // Flag to show/hide error pane
  hasError = false;

  // The base video download url for the org
  get baseVideoUrl() {
    return getBaseVideoUrl(this.baseUrl.data);
  }

  // Get width according to the device's form factor
  get width() {
    switch (FORM_FACTOR) {
      case "Large": {
        return this.desktopWidth;
      }
      case "Medium": {
        return this.tabletWidth;
      }
      case "Small": {
        return this.mobileWidth;
      }
      default: {
        return this.desktopWidth;
      }
    }
  }

  // Get height according to the device's form factor
  get height() {
    switch (FORM_FACTOR) {
      case "Large": {
        return this.desktopHeight;
      }
      case "Medium": {
        return this.tabletHeight;
      }
      case "Small": {
        return this.mobileHeight;
      }
      default: {
        return this.desktopHeight;
      }
    }
  }

  // Show video count in the title if the user wants it
  get computedTitle() {
    return this.showVideoCountInTitle
      ? `${this.title} (${this.totalVideos})`
      : this.title;
  }

  // Getter for current Video we are on
  get currentVideoCount() {
    return this._currentVideoCount;
  }

  // Setter for current Video we are on
  set currentVideoCount(count) {
    const currentVideo = this.videoMap[count];
    const currentDocumentId = currentVideo.ContentDocument.Id;
    this.currentVideoTitle = currentVideo.ContentDocument.Title;
    this.currentVideoDescription = currentVideo.ContentDocument.Description;
    this.currentVideoUrl = this.baseVideoUrl + currentDocumentId;
    this._currentVideoCount = count;
  }

  get computedShowComponent() {
    return this.totalVideos > 0 || !this.hideIfNoVideoAvailable;
  }

  // Event handler for previous button click
  handlePreviousClick() {
    if (this.currentVideoCount > 0) {
      this.currentVideoCount -= 1;
      this.forwardButtonDisabled = false;
    }
    if (this.currentVideoCount === 0) {
      this.previousButtonDisabled = true;
    }
  }

  // Event handler for Next button click
  handleNextClick() {
    if (this.currentVideoCount < this.totalVideos - 1) {
      this.currentVideoCount += 1;
      this.previousButtonDisabled = false;
    }
    if (this.currentVideoCount === this.totalVideos - 1) {
      this.forwardButtonDisabled = true;
    }
  }

  // Lifecycle method to handle errors
  renderedCallback() {
    const video = this.template.querySelector("video");
    if (video) {
      video.addEventListener("error", () => {
        this.hasError = true;
      });
    }
  }

  // Get the base url for the org via apex
  @wire(getBaseUrl)
  baseUrl;

  // Get a list of attached documents based on recordId.
  // If there are no attachments, and the object type is ContentDocument(File)
  // Change the current video url, else show error
  @wire(getAttachedDocuments, { recordId: "$recordId" })
  getDocuments({ error, data }) {
    this.hasLoadingCompleted = true;
    if (data) {
      if (data.length) {
        this.videoMap = Object.assign({}, data);
        this.currentVideoCount = 0;
        this.totalVideos = data.length;
        this.showNavigation = !!(data.length - 1);
        this.hasNoVideos = false;
      } else {
        this.showNavigation = false;
        if (this.objectApiName === CONTENTDOCUMENT_OBJECT.objectApiName) {
          this.hasNoVideos = false;
          this.currentVideoUrl = this.baseVideoUrl + this.recordId;
        }
      }
    }
    if (error) {
      this.hasError = true;
    }
  }
}
