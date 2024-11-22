# Plantuml Document Server

Presents a web UI that allows collaboration with others on PlantUML documents.

Closest alternatives:

- Using the PlantUML Server online, and then copy-pasting the source to a file, and then sharing the file: Tedious
- Hosting a remote VSCode with the PlantUML extension: Excessive and prone to vulnerabilities.

## Running

```bash
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
(cd frontend && npm install) 
(cd backend && npm install)
npm install && npm run dev 
```