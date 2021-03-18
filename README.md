# DrnFrontend
De Rerum Natura Online (DRN) is a flexible framework for creating digital exhibitions. In particular, this demo hosts the heterogeneous collection contained in Vedere l'Invisibile, an exhibition held in Bologna in 2017, regarding the reception of Lucretius' De rerum natura in contemporary art.
Starting from heterogeneous data sources (i.e., items of a collection and textual documents regarding De rerum natura and its translations), the application implements modern technological solutions in order to deliver a system that can be both flexible in terms of requirements, reusable and ephemeral. In particular, Omeka S and TEI Publisher have been employed as sources respectively for items and documents. Angular, a single-page framework application, has been used for building the business logic and presentation layer required for parsing the data and representing them homogeneously. Furthermore, RDF(S), Open Annotation and CIDOC CRM have been employed in the creation of a data model for describing multi-layered, narrative paths designed by the curator.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## TEI Publisher
TEI Publisher facilitates the integration of the TEI Processing Model into exist-db applications. The TEI Processing Model (PM) extends the TEI ODD specification format with a processing model for documents. That way intended processing for all elements can be expressed within the TEI vocabulary itself. It aims at the XML-savvy editor who is familiar with TEI but is not necessarily a developer.

TEI Publisher supports a range of different output media without requiring advanced coding skills. Customising the appearance of the text is all done in TEI by mapping each TEI element to a limited set of well-defined behaviour functions, e.g. “paragraph”, “heading”, “note”, “alternate”, etc. The TEI Processing Model includes a standard mapping, which can be extended by overwriting selected elements. Rendition styles are transparently translated into the different output media types like HTML, XSL-FO, LaTeX, or ePUB. Compared to traditional approaches with XSLT or XQuery, TEI Publisher may thus easily save a few thousand lines of code for media specific stylesheets.

## Installation of TEI Publisher

A prebuilt version of the app can be installed from exist-db's central app repository. On your exist-db installation, open the package manager in the dashboard and select "TEI Publisher" for installation. This should automatically install dependencies such as the "TEI Publisher: Processing Model Libraries."

**Important**: TEI Publisher from version 5.0.0 requires [eXist-db 5.0.0](https://bintray.com/existdb/releases/exist/5.0.0/view/files) or later.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
