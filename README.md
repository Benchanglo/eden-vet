# eden-vet  [![Build Status](http://azai.synology.me:33333/buildStatus/icon?job=eden-vet)](http://azai.synology.me:33333/job/eden-vet/)


This is Eden-vet web frontend builder. The purpose is to automate repetitive tasks and make code update more agile.

Installation
=================
Before you start, you need to install Node.js on your computer. Refer to the website for instructions:

    'https://nodejs.org/'

When installed, clone this repository to you computer, navigate into its directory, and execute this command to install packages, and you are ready to start!

    'npm i'


Development
=================
To develop using this builder, you need to do five things:

1. Write html markup in handlebars syntax, and place the source file in /src/templates
2. Write data for building HTML using Handlebars. This file is /src/data/data-structure.json
3. Write Javascript and place files in /src/js, update gulpfile to include these JS files in specific loading order
4. Write CSS and place files in /src/css, update gulpfile to include these CSS files in specific loading order
5. Regarding images, copy those that you will be using in CSS file into /src/images; and those be used in HTML in /build/images.

Build
=================
In Terminal, navigate to this project folder, and execute this command to build files: 

    'npm run build'

Once it's done, you should see the generated HTML in ../gh-pages/index.html.

Code Quality
=================
You may run this command to validate your Javascript file:

    `npm run lint`

Update Domain
=================
Refer to this doc:
• http://spector.io/how-to-set-up-github-pages-with-a-custom-domain-on-gandi/


Reference
=================
• Npm
  'https://docs.npmjs.com/'

• Handlebars
  'http://handlebarsjs.com/'

• Gulp
  'http://gulpjs.com/'
