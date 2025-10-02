Inhalts-Erstellungs-Workflow mit Telegramm. Er soll die Idee für einen LinkedIn-Post aus einer Telegramm-Nachricht entnehmen, dann soll ein hochwertiger Beitrag zu dem gegebenen Thema erstellt werden. Dafür soll zunächst eine Webrecherche über die Perplexity-API durchgeführt werden. Wenn der Beitrag fertig ist, soll er auf LinkedIn veröffentlich werden, mit dem Hinweis, dass allles erfolgreich veröffentlicht wurde. 
Nodes: Telegram-Nachricht-Trigger, HTTP-Request an Perplexity, If Node zur Prüfung, ob Perplexity eine gültige Antwort geliefert hat, wenn nicht: Telegram-Nachrict mit Details senden. Wenn ja: OpenAI-Nachrichtenmodell zur Beitragserstellung, dann Veröffentlichung auf LinkedIn, danach Telegram-Nachricht mit Text und Erfolgsmeldung.
Dokumentiere alles klar und macht alle Sticky-Nodes in der richtigen Größe. Erstelle zuerst die Gliederung und direkt danach das JSON. Achte darauf, dass es gültig ist.


See:https://www.youtube.com/watch?v=sMGDNYPw43A  6:05