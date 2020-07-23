# Video Viewer Lightning Web Component

![Node.js CI](https://github.com/SalesforceLabs/VideoViewer/workflows/Node.js%20CI/badge.svg)  [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![Video Viewer LWC Logo](https://user-images.githubusercontent.com/12212922/88284656-c4bea300-ccbb-11ea-89a5-5593438b7aa6.png)](https://www.youtube.com/watch?v=8ZJeqbCgMds)

This repository contains code for the Video Viewer LWC.

The Video Viewer component allows you to play any supported video file natively in Salesforce. Currently the following video files are supported - mp4, mov, webm and m4v. There are 2 ways you can use this component.

#### Record Detail Page
Any supported video files attached with this record can now be viewed directly through the component. You can click Previous or Next Buttons to navigate to a different video.

#### File Detail Page
You can also view a supported file directly on a file (ContentDocument) page.

##  Features:
* Supports picture in picture
* Provides 'Mute', 'Seek', and 'Volume' controls
* Fully customizable video dimensions for different device types (desktop, mobile, tablet)
* Fully customizable messages


## Installation

The easiest way to try this component is to install it from [Appexchange](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000GCk6xUAD)
 in a sandbox/ scratch org.

## Installing the component using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub
    - Install Salesforce CLI
    - Install Visual Studio Code
    - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below):

    ```
    sfdx force:auth:web:login -d -a myhuborg
    ```

1. Clone the Video Viewer repository:

    ```
    git clone https://github.com/SalesforceLabs/VideoViewer.git
    ```

1. Create a scratch org and provide it with an alias (**video-viewer** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a video-viewer
    ```

1. Push the component to your scratch org:

    ```
    sfdx force:source:push
    ```

1. Open the scratch org:

    ```
    sfdx force:org:open
    ```

## Usage

1. Go to any record detail page. For example: Case Detail.
1. Click on Edit Page on top right to open Lightning App Builder.
1. Add the component anywhere on the layout and publish the page.
1. If not done already, attach a video file to the reecord detail page using the Files Related List.
1. Any supported files (mp4, mov, webm, or m4v) can now be played directly.
