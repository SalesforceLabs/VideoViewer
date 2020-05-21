/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable jest/valid-describe */
import { createElement } from "lwc";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import getAttachedDocuments from "@salesforce/apex/VideoViewerController.getAttachedDocuments";
import getBaseUrl from "@salesforce/apex/VideoViewerController.getBaseUrl";
import VideoViewer from "../videoViewer";

// An empty list of records
const mockAttachedDocumentsWithNoItems = require("./data/getAttachedDocumentsWithNoItems.json");

// Realistic data with only one attached document
const mockAttachedDocumentsWithOneItem = require("./data/getAttachedDocumentsWithOneItem.json");

// Realistic data with a list of two attached documents
const mockAttachedDocumentsWithTwoItems = require("./data/getAttachedDocumentsWithTwoItems.json");

// Realistic data with a list of three attached documents
const mockAttachedDocumentsWithThreeItems = require("./data/getAttachedDocumentsWithThreeItems.json");

const createComponentUnderTest = () => {
  const element = createElement("c-video-preview", {
    is: VideoViewer
  });
  document.body.appendChild(element);
  return element;
};

const DEFAULT_RECORD_ID = "06A0U0000024SL4UAR";
const CONTENTDOCUMENT_OBJECT_API_NAME = "ContentDocument";
const DEFAULT_BASE_URL = "http://localhost";
const NO_SUPPORTED_VIDEOS_MSG =
  "There are no supported vidoes attached with this record";
const VIDEO_ERROR_MSG = "There was an error playing the video";

const getAttachedDocumentsAdapter = registerApexTestWireAdapter(
  getAttachedDocuments
);

// eslint-disable-next-line no-unused-vars
const getBaseUrlAdapter = registerApexTestWireAdapter(getBaseUrl);

describe("VideoViewer Component on Record Pages", () => {
  let element;

  beforeEach(() => {
    element = createComponentUnderTest();
  });

  afterEach(() => {
    document.body.removeChild(element);
    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });

  [
    {
      property: "title",
      defaultValue: undefined,
      changeValue: "New Title"
    },
    {
      property: "muted",
      defaultValue: undefined,
      changeValue: false
    },
    {
      property: "showVideoName",
      defaultValue: undefined,
      changeValue: false
    },
    {
      property: "desktopWidth",
      defaultValue: undefined,
      changeValue: "100"
    },
    {
      property: "desktopHeight",
      defaultValue: undefined,
      changeValue: "100"
    },
    {
      property: "tabletWidth",
      defaultValue: undefined,
      changeValue: "100"
    },
    {
      property: "tabletHeight",
      defaultValue: undefined,
      changeValue: "100"
    },
    {
      property: "mobileWidth",
      defaultValue: undefined,
      changeValue: "100"
    },
    {
      property: "mobileHeight",
      defaultValue: undefined,
      changeValue: "100"
    }
  ].forEach((propertyTest) => {
    describe(`the "${propertyTest.property}" property`, () => {
      it(`defaults to ${propertyTest.defaultValue}`, () => {
        expect(element[propertyTest.property]).toBe(propertyTest.defaultValue);
      });

      it("reflects a changed value", () => {
        // Ensure the value isn't already set to the target value.
        expect(element[propertyTest.property]).not.toBe(
          propertyTest.changeValue
        );

        // Change the value.
        element[propertyTest.property] = propertyTest.changeValue;

        // Ensure we reflect the changed value.
        expect(element[propertyTest.property]).toBe(propertyTest.changeValue);
      });
    });
  });

  it("displays 1 video element correctly when a record has some files attached to it", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoElement = element.shadowRoot.querySelectorAll("video");
      expect(videoElement.length).toBe(1);
    });
  });

  it(" does not displays a video element correctly when a record has no files attached to it", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithNoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoElement = element.shadowRoot.querySelectorAll("video");
      expect(videoElement.length).toBe(0);
    });
  });

  it("displays the title of component correctly when 2 videos are attached to the record", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Set a title for the element
    element.title = "Available Videos";

    // Allow Video Count to be visible
    element.showVideoCountInTitle = true;

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoComponentTitle = element.shadowRoot.querySelector(
        ".header-title-container"
      );
      expect(videoComponentTitle.textContent).toBe("Available Videos (2)");
    });
  });

  it("displays the title of component correctly when no videos are attached to the record", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithNoItems);

    // Set a title for the element
    element.title = "Available Videos";

    // Allow Video Count to be visible
    element.showVideoCountInTitle = true;

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoComponentTitle = element.shadowRoot.querySelector(
        ".header-title-container"
      );
      expect(videoComponentTitle.textContent).toBe("Available Videos (0)");
    });
  });

  it("displays the no videos text and image when no videos are attached to the record", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithNoItems);

    // Set No Videos Message
    element.noVideoMessage = NO_SUPPORTED_VIDEOS_MSG;

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const noVideosMessageElement = element.shadowRoot.querySelector(
        ".no-video-message"
      );
      const noVideosImage = element.shadowRoot.querySelector(
        'img[src="/img/lbpm/empty.svg"]'
      );
      expect(noVideosMessageElement.textContent).toBe(NO_SUPPORTED_VIDEOS_MSG);
      expect(noVideosImage).toBeDefined();
    });
  });

  it("displays the video tile of the video correctly when showVideoName property is set", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Set the Show Video Name Property
    element.showVideoName = true;

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const titleElement = element.shadowRoot.querySelector("h3");
      expect(titleElement.textContent).toEqual("Test File 1");
    });
  });

  it("displays the description of the video correctly when showVideoDescription property is set", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Set the Show Video Description Property
    element.showVideoDescription = true;

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoDescriptionElement = element.shadowRoot.querySelector(
        ".video-description"
      );
      expect(videoDescriptionElement.textContent).toEqual(
        "Description for Test File 1"
      );
    });
  });

  it("displays the navigation menu (forward/backward) when there are more than 1 videos attached", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      expect(navigationIcons.length).toEqual(2);
    });
  });

  it("does not display the navigation menu (forward/backward) when there is only 1 video attached", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithOneItem);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      expect(navigationIcons.length).toEqual(0);
    });
  });

  it("does not display the navigation menu (forward/backward) when there are no videos attached", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithNoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      expect(navigationIcons.length).toEqual(0);
    });
  });

  it("calculates the correct video url when the component is used on a supported record", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithOneItem);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoElement = element.shadowRoot.querySelector("video");
      const expectedUrl = `${DEFAULT_BASE_URL}/${mockAttachedDocumentsWithOneItem[0].ContentDocumentId}`;
      expect(videoElement.src).toEqual(expectedUrl);
    });
  });

  it("Disables the previous button when there are no more videos while moving backwards", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      const previousButton = navigationIcons[0];
      const nextButton = navigationIcons[1];
      previousButton.click();
      return Promise.resolve().then(() => {
        expect(previousButton.disabled).toBe(true);
        expect(nextButton.disabled).toBe(false);
      });
    });
  });

  it("Disables the next button when there are no more videos while moving forward", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      const previousButton = navigationIcons[0];
      const nextButton = navigationIcons[1];
      nextButton.click();
      return Promise.resolve().then(() => {
        expect(previousButton.disabled).toBe(false);
        expect(nextButton.disabled).toBe(true);
      });
    });
  });

  it("Enable forward and backward buttons when there are videos in both directions", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithThreeItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      const previousButton = navigationIcons[0];
      const nextButton = navigationIcons[1];
      nextButton.click();
      return Promise.resolve().then(() => {
        expect(previousButton.disabled).toBe(false);
        expect(nextButton.disabled).toBe(false);
      });
    });
  });

  it("Disables thee back buttons when there are no videos in backward direction after moving forward once", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithThreeItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const navigationIcons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      const previousButton = navigationIcons[0];
      const nextButton = navigationIcons[1];
      nextButton.click();
      return Promise.resolve().then(() => {
        previousButton.click();
        return Promise.resolve().then(() => {
          expect(previousButton.disabled).toBe(true);
          expect(nextButton.disabled).toBe(false);
        });
      });
    });
  });

  it("Displays an error message when there is an error in retrieving data", () => {
    // Set No Videos Message
    element.noVideoMessage = NO_SUPPORTED_VIDEOS_MSG;
    // Emit error from @wire
    getAttachedDocumentsAdapter.error();

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const errorElement = element.shadowRoot.querySelector(
        ".no-video-message"
      );

      expect(errorElement.textContent).toBe(NO_SUPPORTED_VIDEOS_MSG);
    });
  });

  it("Displays an error message when there is an error in playing the video", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);

    element.errorMessage = VIDEO_ERROR_MSG;

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      const videoElement = element.shadowRoot.querySelector("video");
      const errorEvent = new Event("error");
      videoElement.dispatchEvent(errorEvent);
      return Promise.resolve().then(() => {
        // Select elements for validation
        const errorElement = element.shadowRoot.querySelector(".error-message");
        expect(errorElement.textContent).toBe(VIDEO_ERROR_MSG);
      });
    });
  });

  [
    {
      formFactor: "Large",
      widthProperty: "desktopWidth",
      heightProperty: "desktopHeight",
      width: "1200",
      height: "900"
    },
    {
      formFactor: "Default",
      widthProperty: "desktopWidth",
      heightProperty: "desktopHeight",
      width: "1200",
      height: "800"
    }
  ].forEach((dimensionTest) => {
    it(`renders the video with width: ${dimensionTest.width} and height: ${dimensionTest.height} for the ${dimensionTest.formFactor} form factor`, () => {
      // Emit data from @wire
      getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithTwoItems);
      element[dimensionTest.widthProperty] = dimensionTest.width;
      element[dimensionTest.heightProperty] = dimensionTest.height;

      // Return a promise to wait for any asynchronous DOM updates. Jest
      // will automatically wait for the Promise chain to complete before
      // ending the test and fail the test if the promise rejects.
      return Promise.resolve().then(() => {
        const videoElement = element.shadowRoot.querySelector("video");
        expect(videoElement.width).toBe(+dimensionTest.width);
        expect(videoElement.height).toBe(+dimensionTest.height);
      });
    });
  });
});

describe("VideoViewer Component on ContentDocument Record Pages", () => {
  let element;

  beforeEach(() => {
    element = createComponentUnderTest();
    element.recordId = DEFAULT_RECORD_ID;
    element.objectApiName = CONTENTDOCUMENT_OBJECT_API_NAME;
  });

  afterEach(() => {
    document.body.removeChild(element);
    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });
  it("calculates the correct video url when the component is used on a supported record", () => {
    // Emit data from @wire
    getAttachedDocumentsAdapter.emit(mockAttachedDocumentsWithNoItems);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      // Select elements for validation
      const videoElement = element.shadowRoot.querySelector("video");
      const expectedUrl = `${DEFAULT_BASE_URL}/${DEFAULT_RECORD_ID}`;
      expect(videoElement.src).toEqual(expectedUrl);
    });
  });
});
