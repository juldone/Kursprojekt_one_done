import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // JWT aus dem Header extrahieren

  console.log("Extrahiertes Token:", token); // Debugging, um zu sehen, ob das Token richtig übergeben wird

  if (!token) {
    return res.status(401).json({ message: "Kein Token, Zugriff verweigert" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token validieren
    req.userId = decoded.userId; // Benutzer-ID aus dem Token extrahieren
    console.log("Decoded Token:", decoded); // Debugging, um zu sehen, welche Informationen im Token enthalten sind
    next(); // Weiter zur nächsten Middleware oder Route
  } catch (error) {
    console.error("Fehler bei der Token-Verifizierung:", error);
    return res
      .status(401)
      .json({ message: "Ungültiges Token, Zugriff verweigert" });
  }
}
