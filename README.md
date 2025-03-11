📌 What's in the KML File?

- LineString Example: A simple line with three coordinates.
- MultiLineString Example: Two separate lines.

- Point Example: A single point.

📥 How to Download the KML File

1. Copy the XML content below.

2. Open a text editor (e.g., Notepad, VS Code, Sublime Text).

3. Paste the content into the editor.

4. Save the file with a .kml extension, e.g., example.kml.

📝 KML File Content

```
<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>
        <name>Example KML File</name>
        <description>This is an example KML file for testing.</description>
        <Placemark>
        <name>LineString Example</name>
        <LineString>
        <coordinates>
        -122.0822035425683,37.42228990140251,0
        -122.0819561432097,37.42159782703844,0
        -122.0816520960159,37.42092723492599,0
        </coordinates>
        </LineString>
        </Placemark>
        <Placemark>
        <name>MultiLineString Example</name>
        <MultiGeometry>
        <LineString>
        <coordinates>
        -122.083,37.421,0
        -122.084,37.422,0
        </coordinates>
        </LineString>
        <LineString>
        <coordinates>
        -122.085,37.423,0
        -122.086,37.424,0
        </coordinates>
        </LineString>
        </MultiGeometry>
        </Placemark>
        <Placemark>
        <name>Point Example</name>
        <Point>
        <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>
        </Point>
        </Placemark>
        </Document>
        </kml>
```
