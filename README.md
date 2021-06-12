# SpreadsheetJS
A Library specializing in reading Spreadsheet data from files, based in Typescript
* Focused on reading and parsing data. Supported formats : .xls , xlsx, CSV. 
* Does not support writing. Does not support extracting styles and formatting. Just gets your data right.
* Developed in TS - 4.2.3 (ES2020). Node version : 10.14.0. Created by reverse engineering a spreadsheet AND OpenXML/SpreadsheetML documentation
* Internally Uses Stream based reading for Excel/CSV and SAX based parsing for Excel-XMLs


# Aim
* To support reading of different formats - ods/odf/xlsx/csv
* To make it faster, bug-free, light-weight and more optimized so that it can be compared to other alternatives.


# Contributions are welcome
* If you want to fix any bugs, or extend the library ( or help with documentation), feel free to contribute.
* If you want to contribute, please open an issue with a short description. Also it's advisable to go through current work in pipeline.
* It is recommended to add Unit tests related to your feature/bug


# Current work in pipeline
* Add Support for other Open Office XML formats: .ods/ .ots
* Add tests/specs : Unit, Integration, end-to-end.
* Benchmarking and optimization with respect to other libraries - for runtime, memory consumption and other metrics
