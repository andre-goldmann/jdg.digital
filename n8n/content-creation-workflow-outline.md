# Content-Erstellungs-Workflow mit Telegram - Gliederung

## Workflow-Übersicht
Ein automatisierter Workflow, der Telegram-Nachrichten als Ideenquelle für LinkedIn-Posts nutzt, Webrecherche durchführt und hochwertige Beiträge erstellt.

## Node-Struktur

### 1. Telegram Trigger Node
- **Typ**: Telegram Trigger
- **Funktion**: Empfängt eingehende Telegram-Nachrichten als Workflow-Auslöser
- **Position**: Startpunkt des Workflows
- **Konfiguration**: Bot-Token und Webhook-Setup erforderlich

### 2. HTTP Request Node (Perplexity API)
- **Typ**: HTTP Request
- **Funktion**: Führt Webrecherche über Perplexity API durch
- **Input**: Telegram-Nachrichtentext als Suchquery
- **Output**: Rechercheergebnisse für Content-Erstellung

### 3. IF Node (Perplexity Response Check)
- **Typ**: IF (Conditional Logic)
- **Funktion**: Prüft Gültigkeit der Perplexity-Antwort
- **Bedingung**: Überprüfung auf erfolgreiche API-Response
- **Verzweigung**: True/False Pfade

### 4a. Error Telegram Node (False Path)
- **Typ**: Telegram
- **Funktion**: Sendet Fehlermeldung bei ungültiger Perplexity-Response
- **Trigger**: Wenn IF Node = False
- **Content**: Fehlerdetails und Retry-Hinweise

### 4b. OpenAI Node (True Path)
- **Typ**: OpenAI
- **Funktion**: Erstellt hochwertigen LinkedIn-Post basierend auf Recherche
- **Input**: Perplexity-Rechercheergebnisse + Original-Idee
- **Model**: GPT-4 oder ähnlich für Qualitätscontent

### 5. LinkedIn Node
- **Typ**: LinkedIn
- **Funktion**: Veröffentlicht erstellten Post auf LinkedIn
- **Input**: Von OpenAI generierter Content
- **Authentication**: LinkedIn OAuth erforderlich

### 6. Success Telegram Node
- **Typ**: Telegram
- **Funktion**: Sendet Erfolgsmeldung mit Post-Details
- **Content**: Bestätigung der LinkedIn-Veröffentlichung + Post-Text

## Sticky Notes für Dokumentation

### Note 1: Workflow-Beschreibung
- **Position**: Oben links
- **Inhalt**: Workflow-Übersicht und Zweck
- **Größe**: 300x150px

### Note 2: API-Konfiguration
- **Position**: Mitte rechts
- **Inhalt**: Erforderliche API-Keys und Konfigurationshinweise
- **Größe**: 250x200px

### Note 3: Error Handling
- **Position**: Unten links
- **Inhalt**: Fehlerbehandlung und Troubleshooting
- **Größe**: 280x120px

### Note 4: Workflow-Flow
- **Position**: Unten rechts
- **Inhalt**: Datenfluss und Node-Verbindungen
- **Größe**: 320x140px

## Datenfluss
1. Telegram Message → Text Extraction
2. Text → Perplexity API Query
3. API Response → Validation Check
4. Valid Response → OpenAI Content Generation
5. Generated Content → LinkedIn Publishing
6. Success → Telegram Notification

## Erforderliche Credentials
- Telegram Bot Token
- Perplexity API Key
- OpenAI API Key
- LinkedIn OAuth Credentials

## Node-Positionen (ungefähr)
- Telegram Trigger: (0, 0)
- HTTP Request (Perplexity): (200, 0)
- IF Node: (400, 0)
- Error Telegram: (400, 150)
- OpenAI Node: (600, 0)
- LinkedIn Node: (800, 0)
- Success Telegram: (1000, 0)