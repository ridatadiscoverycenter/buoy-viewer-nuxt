# Unity Volume Viewer Web App

## Building a WebGL project
1. In Unity, open the build settings window (**File > Build Settings**)
2. Select **WebGL** from the platform list
3. Navigate to Player Settings
    - **Edit > Project Settings**
    - Select **Player Category** on the left
    - Under **Optimization** check **Strip Engine Code**
        - This option should be checked by default to enable code stripping for WebGL. Unity they won't include any code for classes that aren't used. 
    - Under **Publishing Settings**
        - Set **Compression Format** to **Disabled**
        - Check **Decompression Fallback**
            - Unity appends `.unityweb` to build file names
4. Back in the build settings window
    - Add open scenes
    - Check the scenes to build
    - Click **Build** or **Build and Run** and choose where to save the build files

- For more instructions [Unity Docs: Building and running a WebGL project](https://docs.unity3d.com/Manual/webgl-building.html)

## Testing Locally
When you choose the *Build and Run* option, Unity internally serves your build with a static local web server. However, the workflow requires building and then running again. 

> You can view your WebGL player directly in most browsers by simply opening the index.html file. For security reasons, Chrome places restrictions on scripts opened from local file: URLs, so this technique will not work. If you use Unity’s Build & Run command (menu: File > Build & Run) then the file will be temporarily hosted in a local web server and opened from a localhost URL (this avoids the security restrictions). You can also run Chrome with the --allow-file-access-from-files command line option to enable it to load content from file: urls. This is required on a PC to allow execution of the build. ([Source](https://docs.unity3d.com/550/Documentation/Manual/webgl-building.html))

Instead, we can run our own server. We can install the serve package using npm.
1. `npm install -g serve`
2. Navigate (`cd`) to the WebGL build folder
3. `serve`
4. A local server should run and then we can view out Unity WebGL Build there

## Adding the Build files to this repository
- Copy and paste the entire contents of the build folder that you generate into this repository.
```
Build/
TemplateData/
index.html
```

## Demo
[Link to Github Pages](https://brown-ccv.github.io/unity-volume-viewer-web-app/)