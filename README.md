# ng-pos

___ng-pos___ is a web application built using angular. Its job? Simple inventory management, logging sales/purchases and displaying monthly profit, sales/purchases statistics. That's it.

## DEMO
[DEMO](https://ericnjuki.github.io/hemedisapp)

___ng-pos___ use a backend service that sends json.
[The API](https://github.com/ericnjuki/ngpos-api) 

## Building and running the app
The app is not use-ready and is not meant to be used. Just cruise through, look at the demo, click on stuff, look at the crappy code, when you're done press CTRL+W and thank me later.

The app has been tested on the following setup:
* Windows 10 Home
* Chrome  63.0.3239.84 (64-bit)

and is NOT guaranteed to work elsewhere.


* #### Building and Deploying the app locally (on IIS or APACHE), PART I
 * ###### Step 1
    You can download the dist folder [here](https://github.com/ericnjuki/hemedisapp/releases/download/v0.2.0/dist.zip) and skip to [*Step 6*](#step-6).

 * ###### Step 1

    pull master branch on this repository and run `npm -i` in the folder containing `package.json` file on your command line to install the required dependencies

 * ###### Step 2

    Ensure you have angular 4+ installed, run `ng serve` and browse `localhost:4200` on your browser (check supported browsers above) to ensure the app works. Don't mind the console 404 error for localhost:1111...., we'll get to that.
    If this Step doesn't work, file an issue, If I don't respond give up, the demo works fine.

 * ###### Step 3
    If you choose to host the server on localhost:1111 then skip this step, else:

    Open `src/app/services/items.service.ts`
    and change the value of `_url` from `http://localhost:1111/api/v1.0/items/` to `path/to/where/you'll/host/service/api/v1.0/items/`

    And do the same for `src/app/services/transacs.service.ts`
 * ###### Step 4

    build the app by running `ng build -prod -bh "./"`
    This creates a `dist` folder in the project

 * ###### Step 5 Add a Web.config if on IIS

    Create a file, call it Web, give it .config extension, and copy this into it and save it in your dist folder

    ```C#
    <configuration>
        <system.webServer>
            <rewrite>
            <rules>
                <rule name="Main Rule" stopProcessing="true">
                        <match url=".*" />
                        <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        </conditions>
                        <action type="Rewrite" url="/" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>
    ```
 * ###### Step 6

    (IIS) copy dist folder contents to a new folder from where you want the app to be served, create new IIS website pointing to this folder.

    (APACHE) copy dist folder to `htdocs` folder, (and rename it to 'ng-pos'). Browse `localhost:8080/ng-pos` to access the app

    _For other deployment options, search how to deploy angular apps._

* #### Building and Deploying the app locally (on IIS or APACHE) PART II

    Now we need to set up the api.
    Api requires .NET framework 4.5 and and sqlserver installed to run.
    If you don't have both, give up here.

 * ###### Step 1
    Download the api files [here](https://github.com/ericnjuki/ngpos-api/files/1812142/ngposAPI.zip)

 * ###### Step 2: Deploy!
    copy the files into a folder called `ng-posAPI` and put the folder in `htdocs` folder to deploy to APACHE and access it via `http://localhost:8080/ng-posAPI`
    
    or create website on IIS and point it to where `ng-posAPI` is.

    Try accessing this url :

    `http://localhost:8080/ng-posAPI/api/v1.0/items/g`
    for apache and

    `http://localhost:{set port}/api/v1.0/items/g`
    for IIS

    *Make sure this is the url pointed to by the app as in [Part I Step 3](#step-3) above.*
    Mine was deployed to http://localhost:1111

    You should see something similar to this on the browser:
    ![Output](src/assets/docs-pics/array-of-item.png)


    _For other deployment options, search how to deploy ASP.NET WebAPI 2 applications._

You can now visit the deployed angular site and Try interacting with the site.

* ##### This is how the app works:
This part of the readme can be accessed from previous versions. I removed it because the app is changing so much and I can't keep rewriting how to use the app each time.
Plus I really didn't mean for this app to be used, it started out a school project though it now has 1 user :smiley:

### A couple of things I did wrong with this one
1. Started using and depended on jQuery from the start, instead of *first* trying to find the 'Angular way'. This led to an underuse of a lot of sweet angular features.
1. Wrote my own form validation instead of using already established, better form-validation solutions, and input elements instead of contenteditables would probably have been best.
1. Used more than one UI framework (angular-material + bootstrap)
1. Bad design, bad UI, didn't think of user (improved in v0.2.0).
1. Spent too much time initially working on UI instead of getting the app to work first. This led to a lot of late-stage undiscovered bugs which were frustrating to say the least.


kudos for making it all the way here! :clap: